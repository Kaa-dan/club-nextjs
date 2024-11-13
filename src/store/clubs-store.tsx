import { TClub } from "@/types";
import { create } from "zustand";

interface ClubState {
  userJoinedClubs: TClub[];
  userRequestedClubs: any[];
  setUserJoinedClubs: (userJoinedClub: TClub[]) => void;
  setUserRequestedClubs: (userRequestedClubs: any[]) => void;
}

export const useClubStore = create<ClubState>()((set) => ({
  userJoinedClubs: [],
  userRequestedClubs: [],
  setUserJoinedClubs: (userJoinedClubs) => set({ userJoinedClubs }),
  setUserRequestedClubs: (userRequestedClubs) => set({ userRequestedClubs }),
}));
