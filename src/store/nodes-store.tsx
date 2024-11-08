import { TClub, TNodeData } from "@/types";
import { create } from "zustand";

interface NodeState {
  userJoinedNodes: TNodeData[];
  setUserJoinedNodes: (userJoinedClub: TNodeData[]) => void;
}

export const useNodeStore = create<NodeState>()((set) => ({
  userJoinedNodes: [],
  setUserJoinedNodes: (userJoinedClubs) =>
    set({ userJoinedNodes: userJoinedClubs }),
}));
