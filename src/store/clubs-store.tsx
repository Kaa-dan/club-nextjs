import { TClub, TMembers } from "@/types";
import { create } from "zustand";

interface ICurrentClub {
  club: TClub;
  members: TMembers[];
}

interface ClubState {
  userJoinedClubs: TClub[];
  userRequestedClubs: any[];
  currentClub: ICurrentClub | null;
  currentUserRole: TUserRole;
  setUserJoinedClubs: (userJoinedClub: TClub[]) => void;
  setUserRequestedClubs: (userRequestedClubs: any[]) => void;
  setCurrentClub: (currentClub: ICurrentClub) => void;
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
