import { TClub, TNodeData } from "@/types";
import { create } from "zustand";

interface NodeState {
  userJoinedNodes: TNodeData[];
  userRequestedNodes: any[];
  currentNode: TNodeData | null;
  setUserJoinedNodes: (userJoinedClub: TNodeData[]) => void;
  setUserRequestedNodes: (userRequestedNodes: any[]) => void;
  setCurrentNode: (currentNode: TNodeData) => void;
}

export const useNodeStore = create<NodeState>()((set) => ({
  userJoinedNodes: [],
  userRequestedNodes: [],
  currentNode: null,
  setUserJoinedNodes: (userJoinedClubs) =>
    set({ userJoinedNodes: userJoinedClubs }),
  setUserRequestedNodes: (userRequestedNodes) =>
    set({ userRequestedNodes: userRequestedNodes }),
  setCurrentNode: (currentNode) => set({ currentNode }),
}));
