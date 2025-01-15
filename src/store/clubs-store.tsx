import { TClub, TMembers } from "@/types";
import { create } from "zustand";

interface ICurrentClub {
  club: TClub;
  members: TMembers[];
  chapters: any;
}

interface ClubState {
  userJoinedClubs: TClub[];
  userRequestedClubs: any[];
  currentClub: ICurrentClub | null;
  currentUserRole: TUserRole | null;
  clubJoinStatus: TJoinStatus | null;
  setUserJoinedClubs: (userJoinedClub: TClub[]) => void;
  setUserRequestedClubs: (userRequestedClubs: any[]) => void;
  setCurrentClub: (currentClub: ICurrentClub) => void;
  setCurrentUserRole: (currentUserRole: TUserRole | null) => void;
  setClubJoinStatus: (clubJoinStatus: TJoinStatus) => void;
}

export const useClubStore = create<ClubState>()((set) => ({
  userJoinedClubs: [],
  userRequestedClubs: [],
  currentClub: null,
  currentUserRole: null,
  clubJoinStatus: null,
  setUserJoinedClubs: (userJoinedClubs) => set({ userJoinedClubs }),
  setUserRequestedClubs: (userRequestedClubs) => set({ userRequestedClubs }),
  setCurrentClub: (currentClub) => set({ currentClub }),
  setCurrentUserRole: (currentUserRole) => set({ currentUserRole }),
  setClubJoinStatus: (clubJoinStatus) => set({ clubJoinStatus }),
}));
