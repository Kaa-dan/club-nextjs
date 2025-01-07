import { TChapter } from "@/types";
import { create } from "zustand";

interface ChapterState {
  publishedChapters: TChapter[];
  proposedChapters: TChapter[];
  currentChapter: TChapter;
  chapterMembers: any[];
  chapterJoinStatus: TJoinStatus | null;
  currentUserChapterRole: TUserRole | null;
  setPublishedChapters: (chapters: TChapter[]) => void;
  setProposedChapters: (chapters: TChapter[]) => void;
  setCurrentUserChapterRole: (currentUserRole: TUserRole | null) => void;
  setCurrentChapter: (chapter: TChapter) => void;
  setChapterMembers: (chapterMembers: any[]) => void;
  setChapterJoinStatus: (chapterJoinStatus: TJoinStatus) => void;
}

export const useChapterStore = create<ChapterState>()((set) => ({
  publishedChapters: [],
  proposedChapters: [],
  currentUserChapterRole: null,
  currentChapter: {} as TChapter,
  chapterMembers: [],
  chapterJoinStatus: null,
  setPublishedChapters: (publishedChapters) => set({ publishedChapters }),
  setProposedChapters: (proposedChapters) => set({ proposedChapters }),
  setCurrentUserChapterRole: (currentUserChapterRole) =>
    set({ currentUserChapterRole }),
  setCurrentChapter: (currentChapter) => set({ currentChapter }),
  setChapterMembers: (chapterMembers) => set({ chapterMembers }),
  setChapterJoinStatus: (chapterJoinStatus) => set({ chapterJoinStatus }),
}));
