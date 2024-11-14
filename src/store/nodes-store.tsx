import { TClub, TNodeData } from "@/types";
import { create } from "zustand";

interface NodeState {
  userJoinedNodes: TNodeData[];
  userRequestedNodes: any[];
  setUserJoinedNodes: (userJoinedClub: TNodeData[]) => void;
  setUserRequestedNodes: (userRequestedNodes: any[]) => void;
}

export const useNodeStore = create<NodeState>()((set) => ({
  userJoinedNodes: [],
  userRequestedNodes: [],
  setUserJoinedNodes: (userJoinedClubs) =>
    set({ userJoinedNodes: userJoinedClubs }),
  setUserRequestedNodes: (userRequestedNodes) =>
    set({ userRequestedNodes: userRequestedNodes }),
}));
