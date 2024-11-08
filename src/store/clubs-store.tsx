import { TClub } from "@/types";
import { create } from "zustand";

interface ClubState {
  userJoinedClubs: TClub[];
  setUserJoinedClubs: (userJoinedClub: TClub[]) => void;
}

export const useClubStore = create<ClubState>()((set) => ({
  userJoinedClubs: [],
  setUserJoinedClubs: (userJoinedClubs) => set({ userJoinedClubs }),
}));
