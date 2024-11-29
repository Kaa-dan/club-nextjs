// import { createContext, useContext, ReactNode } from "react";
// import useSocket from "@/hooks/use-socket";
// import { useAnimationFrame } from "framer-motion";

// const SocketContext = createContext<ReturnType<typeof useSocket> | null>(null);

// export const SocketProvider = ({ children }: { children: ReactNode }) => {
//   const socketUtils = useSocket();

//   return (
//     <SocketContext.Provider value={socketUtils}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocketContext = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocketContext must be used within a SocketProvider");
//   }
//   return context;
// };

// // // 3. Example usage in a component (components/Comments.tsx)
// // import { useEffect, useState } from "react";
// // import { useSocketContext } from "@/components/SocketProvider";
// // import type { CommentPayload } from "@/lib/socket";

// // export const Comments = ({ postId }: { postId: string }) => {
// //   const { socket, sendComment, joinPost, leavePost } = useSocketContext();
// //   const [comments, setComments] = useState<CommentPayload[]>([]);

// //   useEffect(() => {
// //     // Join the post's room
// //     joinPost(postId);

// //     // Listen for new comments
// //     socket.on("commentAdded", (comment) => {
// //       setComments((prev) => [...prev, comment]);
// //     });

// //     // Cleanup
// //     return () => {
// //       leavePost(postId);
// //       socket.off("commentAdded");
// //     };
// //   }, [postId, socket, joinPost, leavePost]);

// //   const handleSubmitComment = (content: string) => {
// //     const comment: CommentPayload = {
// //       content,
// //       postId,
// //       userId: "current-user-id", // Replace with actual user ID
// //       createdAt: new Date(),
// //     };

// //     sendComment(comment);
// //     // Optimistically add to local state
// //     setComments((prev) => [...prev, comment]);
// //   };

// //   return <div>{/* Your comment UI here */}</div>;
// // };
