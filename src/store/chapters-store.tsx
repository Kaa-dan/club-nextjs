import { TChapter } from "@/types";
import { create } from "zustand";

interface ChapterState {
  publishedChapters: TChapter[];
  proposedChapters: TChapter[];
  setPublishedChapters: (chapters: TChapter[]) => void;
  setProposedChapters: (chapters: TChapter[]) => void;
}

export const useChapterStore = create<ChapterState>()((set) => ({
  publishedChapters: [],
  proposedChapters: [],
  setPublishedChapters: (publishedChapters) => set({ publishedChapters }),
  setProposedChapters: (proposedChapters) => set({ proposedChapters }),
}));
