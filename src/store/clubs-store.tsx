import { TClub } from "@/types";
import { create } from "zustand";

interface ClubState {
  userJoinedClubs: TClub[];
  userRequestedClubs: any[];
  selectedClub: TClub | null;
  setUserJoinedClubs: (userJoinedClub: TClub[]) => void;
  setUserRequestedClubs: (userRequestedClubs: any[]) => void;
  setSelectedClub: (selectedClub: TClub) => void;
}

export const useClubStore = create<ClubState>()((set) => ({
  userJoinedClubs: [],
  userRequestedClubs: [],
  selectedClub: null,
  setUserJoinedClubs: (userJoinedClubs) => set({ userJoinedClubs }),
  setUserRequestedClubs: (userRequestedClubs) => set({ userRequestedClubs }),
  setSelectedClub: (selectedClub) => set({ selectedClub }),
}));
