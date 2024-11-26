import { TMembers, TNodeData } from "@/types";
import { create } from "zustand";

interface ICurrentNode {
  node: TNodeData;
  members: TMembers[];
}

interface NodeState {
  userJoinedNodes: TNodeData[];
  userRequestedNodes: any[];
  currentNode: ICurrentNode | null;
  currentUserRole: TUserRole;
  setUserJoinedNodes: (userJoinedClub: TNodeData[]) => void;
  setUserRequestedNodes: (userRequestedNodes: any[]) => void;
  setCurrentNode: (currentNode: ICurrentNode) => void;
  setCurrentUserRole: (currentUserRole: TUserRole) => void;
}

export const useNodeStore = create<NodeState>()((set) => ({
  userJoinedNodes: [],
  userRequestedNodes: [],
  currentNode: null,
  currentUserRole: "member",
  setCurrentUserRole: (currentUserRole) => set({ currentUserRole }),
  setUserJoinedNodes: (userJoinedClubs) =>
    set({ userJoinedNodes: userJoinedClubs }),
  setUserRequestedNodes: (userRequestedNodes) =>
    set({ userRequestedNodes: userRequestedNodes }),
  setCurrentNode: (currentNode) => set({ currentNode }),
}));
