import { useState, useEffect } from "react";
import useGet from "../hooks/useGet";
import usePut from "../hooks/usePut";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setMessage } from "../redux/slices/messageSlice";
import type { Message } from "../types/Message";
import type { RootState } from "../redux/store";
import { MdReply, MdEdit } from "react-icons/md";

// definiera ett objekt som grupperar meddelanden efter användar id
interface GroupedMessages {
  [userId: string]: Message[];
}

const AdminInbox = () => {
  // hämta laddningsstatus för meddelanden från redux
  const { loading: messageLoading } = useSelector(
    (state: RootState) => state.message
  );

  // hämta token från redux
  const { token } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  const Database_API_URL = import.meta.env.VITE_DATABASE_API_URL;

  // lokalt state för alla meddelanden
  const [messages, setMessages] = useState<Message[]>([]);

  // lokalt state för admins svar
  const [replyText, setReplyText] = useState("");

  // id för det meddelande som redigeras på just nu
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  // sparar originalsvaret innan redigering påbörjas
  const [originalReply, setOriginalReply] = useState("");

  // statusmeddelande som visar om svaret lyckades eller misslyckades
  const [replyStatus, setReplyStatus] = useState<"success" | "error" | "">("");

  // hämta alla meddelanden från backend
  const {
    data,
    error: fetchError,
    loading: fetchLoading,
    fetchData,
  } = useGet<Message[]>(
    `${Database_API_URL}/api/message/all`,
    messageLoading,
    "",
    token || ""
  );

  // för att uppdatera ett svar
  const { loading: putLoading, updateData } = usePut(
    activeMessageId
      ? `${Database_API_URL}/api/message/reply/${activeMessageId}`
      : ""
  );

  // meddelanden ska hämtas och anropa fetch
  useEffect(() => {
    if (messageLoading) {
      fetchData();
      dispatch(setLoading(false));
    }
  }, [messageLoading]);

  // när data hämtas uppdatera lokalt state och redux store
  useEffect(() => {
    if (data) {
      setMessages(data);
      dispatch(setMessage(data));
    }
  }, [data]);

  // gruppera meddelanden per användare
  const groupedMessages: GroupedMessages = messages.reduce((groups, msg) => {
    const id = msg.userId._id;
    if (!groups[id]) groups[id] = [];
    groups[id].push(msg);
    return groups;
  }, {} as GroupedMessages);

  // användaren klickar på svara eller redigera
  const handleReplyClick = (messageId: string, currentReply: string = "") => {
    setActiveMessageId(messageId);
    setReplyText(currentReply);
    setOriginalReply(currentReply);
    setReplyStatus("");
  };

  // användaren skickar in ett svar
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessageId) return;

    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === activeMessageId
            ? {
                ...msg,
                adminReply: replyText,
                repliedAt: new Date().toISOString(),
              }
            : msg
        )
      );

      // skicka uppdateringen till backend
      await updateData({ reply: replyText });
      setReplyStatus("success");
    } catch (error) {
      console.error(error);
      // återställ om det blev fel
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === activeMessageId
            ? {
                ...msg,
                adminReply: originalReply,
              }
            : msg
        )
      );
      setReplyStatus("error");
    } finally {
      setActiveMessageId(null);
    }
  };

  // avbrytning klick
  const handleCancel = () => {
    if (originalReply) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === activeMessageId
            ? {
                ...msg,
                adminReply: originalReply,
              }
            : msg
        )
      );
    }
    setActiveMessageId(null);
  };

  // visa laddningsstatus
  if (fetchLoading)
    return (
      <div className="text-center mt-5">
        <div
          className="spinner-border text-warning"
          id="spinner-size"
          role="status"
        >
          <span className="visually-hidden">Loading messages...</span>
        </div>
      </div>
    );

  // visa felmeddelande om hämtning misslyckas
  if (fetchError)
    return (
      <div className="alert alert-danger" role="alert">
        Error retrieving messages: {fetchError}
      </div>
    );

  return (
    <div className="container my-4">
      {/* visa statusmeddelanden */}
      {replyStatus === "success" && (
        <div className="alert alert-success" role="alert">
          Reply saved!
        </div>
      )}
      {replyStatus === "error" && (
        <div className="alert alert-danger" role="alert">
          Failed to save reply!
        </div>
      )}

      <h2 className="mb-4">Admin Messages</h2>

      {/* visa om det inte finns några meddelanden */}
      {messages.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          There are no new messages!
        </div>
      ) : (
        // visa grupperade meddelanden
        Object.entries(groupedMessages).map(([userId, userMessages]) => (
          <div key={userId} className="card mb-4 shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h1 className="mb-0 fs-3">
                Customer: {userMessages[0].userId.email}
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
                      <strong className="text-black">Subject:</strong>{" "}
                      {msg.subject}
                    </h6>
                    <p className="mb-0">
                      <strong>Customer's name:</strong> {msg.userId.name} (
                      {msg.userId.email})
                    </p>
                    <p className="mb-1">
                      <strong>Message:</strong> {msg.message}
                    </p>
                    <p className="mb-1">
                      <strong>Admin's answer:</strong>{" "}
                      {msg.adminReply ? (
                        <span className="text-success">{msg.adminReply}</span>
                      ) : (
                        <span className="text-muted">Not answered yet</span>
                      )}
                    </p>
                    <small className="text-muted">
                      Sent: {new Date(msg.createdAt).toLocaleString()}
                    </small>

                    {/* visa svarsfält om det är aktivt */}
                    {activeMessageId === msg._id ? (
                      <form onSubmit={handleReplySubmit} className="mt-2">
                        <textarea
                          className="form-control mb-2"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          required
                          rows={3}
                          placeholder="Write your reply"
                          disabled={putLoading}
                        />
                        <button
                          type="submit"
                          className="btn btn-primary me-2"
                          disabled={putLoading}
                        >
                          {putLoading ? "Saving..." : "Save Reply"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCancel}
                          disabled={putLoading}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <br />
                        <button
                          className={`btn mt-2 ${
                            msg.adminReply
                              ? "btn-outline-warning"
                              : "btn-outline-primary"
                          }`}
                          onClick={() =>
                            handleReplyClick(msg._id, msg.adminReply || "")
                          }
                        >
                          {msg.adminReply ? (
                            <>
                              <MdEdit /> Edit Reply
                            </>
                          ) : (
                            <>
                              <MdReply /> Reply
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminInbox;
