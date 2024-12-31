import { TChapter } from "@/types";
import { create } from "zustand";

interface ChapterState {
  publishedChapters: TChapter[];
  setPublishedChapters: (chapters: TChapter[]) => void;
}

export const useChapterStore = create<ChapterState>()((set) => ({
  publishedChapters: [],
  setPublishedChapters: (publishedChapters) => set({ publishedChapters }),
}));
