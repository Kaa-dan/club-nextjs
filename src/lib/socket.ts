import { io, Socket } from "socket.io-client";
import env from "./env.config";

export interface CommentPayload {
  content: string;
  postId: string;
  userId: string;
  createdAt?: Date;
}

interface ServerToClientEvents {
  commentAdded: (comment: CommentPayload) => void;
}
interface ClientToServerEvents {
  newComment: (comment: CommentPayload) => void;
  joinPost: (postId: string) => void;
  leavePost: (postId: string) => void;
}

export type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

export const socket: SocketInstance = io(env.BACKEND_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
