import { useState, useEffect } from "react";
import useGet from "../hooks/useGet";
import usePut from "../hooks/usePut";
import { useDispatch, useSelector } from "react-redux";
import {setLoading, setMessage} from '../redux/slices/messageSlice';
import type { Message } from "../types/Message";
import type { RootState } from "../redux/store";

interface GroupedMessages {
  [userId: string]: Message[];
}

const AdminInbox = () => {
  const { loading: messageLoading } = useSelector((state: RootState) => state.message);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const { token } = useSelector((state: RootState) => state.auth);
  const Database_API_URL = import.meta.env.VITE_DATABASE_API_URL;

    // hämtar alla meddelanden från databas
  const {
    data,
    error: fetchError,
    loading: fetchLoading,
    fetchData
  } = useGet<Message[]>(
    `${Database_API_URL}/api/message/all`,
    messageLoading,
    "",
    token || ""
  );
    // hittar det senaste meddelandet för användaren som är aktiv
  const lastMessageIdForUser = activeUserId
    ? messages
        .filter((msg) => msg.userId._id === activeUserId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]?._id
    : null;
 // hook för att skicka PUT request med svar till API
  const {
    data: putData,
    error: putError,
    loading: putLoading,
    updateData,
  } = usePut(
    lastMessageIdForUser
      ? `${Database_API_URL}/api/message/reply/${lastMessageIdForUser}`
      : ""
  );

  useEffect(() => {
    if (messageLoading) {
      fetchData()
      dispatch(setLoading(false));
    }
  }, [messageLoading, fetchData])
// uppdaterar meddelanden när nya data hämtats från databasen
  useEffect(() => {
    if (data) {
      setMessages(data);
      dispatch(setMessage(data))
    }
  }, [data]);
     // När ett svar skickats uppdateras det lokala state
  useEffect(() => {
    if (putData && lastMessageIdForUser) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === lastMessageIdForUser
            ? {
                ...msg,
                adminReply: replyText,
                repliedAt: new Date().toISOString(),
              }
            : msg
        )
      );
      setActiveUserId(null);
      setReplyText("");
    }
  }, [putData, lastMessageIdForUser, replyText]);

  // Grupperar meddelanden per användare
  const groupedMessages: GroupedMessages = messages.reduce((groups, msg) => {
    const id = msg.userId._id;
    if (!groups[id]) groups[id] = [];
    groups[id].push(msg);
    return groups;
  }, {} as GroupedMessages);
// hanterar klick på svarsknapp för en användare
  const handleReplyClick = (userId: string) => {
    setActiveUserId(userId);
    setReplyText("");
  };
 //hanterar inskick av svar 
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !lastMessageIdForUser) return;

    await updateData({ reply: replyText });
  };

  if (fetchLoading) return <p>Loading messages...</p>;
  if (fetchError)
    return (
      <p className="text-danger">
        Error retrieving messages: {fetchError}
      </p>
    );

  return (
    <div className="container my-4">
      <h2 className="mb-4">Admin Messages</h2>
      {messages.length === 0 ? (
        <p>Inga meddelanden</p>
      ) : (
        Object.entries(groupedMessages).map(([userId, userMessages]) => (
          <div key={userId} className="card mb-4 shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h1 className="mb-0 fs-3">
                Användare:{" "}  
                {userMessages[0].userId.email}
              </h1>
            </div>
            <div className="card-body">
              {userMessages
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((msg) => (
                  <div key={msg._id} className="mb-3 border-bottom pb-2">
                    <h6 className="card-subtitle mb-1 text-primary">
                      <strong className="text-black">Subject:</strong> {msg.subject}
                    </h6>
                    <p className="mb-0">
                      <strong>Costumer:</strong> {userMessages[0].userId.name} (
                      {userMessages[0].userId.email})
                    </p>

                    <p className="mb-1">
                      <strong>Message:</strong> {msg.message}
                    </p>
                    <p className="mb-1">
                      <strong>Admins answer:</strong>{" "}
                      {msg.adminReply ? (
                        <span className="text-success">{msg.adminReply}</span>
                      ) : (
                        <span className="text-muted">Not answer yet</span>
                      )}
                    </p>
                    <small className="text-muted">
                      Sent: {new Date(msg.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}

              {activeUserId === userId ? (
                <form onSubmit={handleReplySubmit}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      rows={3}
                      placeholder="Skriv svar här"
                      disabled={putLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={putLoading}
                  >
                    {putLoading ? "Skickar..." : "Skicka svar"}
                  </button>
                  {putError && (
                    <p className="text-danger mt-2">Error in response: {putError}</p>
                  )}
                </form>
              ) : (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleReplyClick(userId)}
                >
                  Answer
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminInbox;
