export interface Message {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  message: string;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
}
