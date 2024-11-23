import { TClub } from "@/types";
import { create } from "zustand";

interface ClubState {
  userJoinedClubs: TClub[];
  userRequestedClubs: any[];
  currentClub: TClub | null;
  currentUserRole: TUserRole;
  setUserJoinedClubs: (userJoinedClub: TClub[]) => void;
  setUserRequestedClubs: (userRequestedClubs: any[]) => void;
  setCurrentClub: (currentClub: TClub) => void;
  setCurrentUserRole: (currentUserRole: TUserRole) => void;
}

export const useClubStore = create<ClubState>()((set) => ({
  userJoinedClubs: [],
  userRequestedClubs: [],
  currentClub: null,
  currentUserRole: "member",
  setUserJoinedClubs: (userJoinedClubs) => set({ userJoinedClubs }),
  setUserRequestedClubs: (userRequestedClubs) => set({ userRequestedClubs }),
  setCurrentClub: (currentClub) => set({ currentClub }),
  setCurrentUserRole: (currentUserRole) => set({ currentUserRole }),
}));
