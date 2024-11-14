import { create } from "zustand";

interface CommentsState {
  comments: TCommentType[];
  setComments: (comments: TCommentType[]) => void;
}

export const useCommentsStore = create<CommentsState>()((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
}));
