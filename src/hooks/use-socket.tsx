import { CommentPayload, socket } from "@/lib/socket";
import { useEffect, useCallback } from "react";

const useSocket = (url: string) => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendComment = useCallback((comment: CommentPayload) => {
    socket.emit("newComment", comment);
  }, []);

  return {
    socket,
    sendComment,
  };
};

export default useSocket;
