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
  currentUserRole: TUserRole | null;
  nodeJoinStatus: TJoinStatus | null;
  setUserJoinedNodes: (userJoinedNodes: TNodeData[]) => void;
  setUserRequestedNodes: (userRequestedNodes: any[]) => void;
  setCurrentNode: (currentNode: ICurrentNode) => void;
  setCurrentUserRole: (currentUserRole: TUserRole | null) => void;
  setNodeJoinStatus: (nodeJoinStatus: TJoinStatus) => void;
}

export const useNodeStore = create<NodeState>()((set) => ({
  userJoinedNodes: [],
  userRequestedNodes: [],
  currentNode: null,
  currentUserRole: null,
  nodeJoinStatus: null,
  setCurrentUserRole: (currentUserRole) => set({ currentUserRole }),
  setUserJoinedNodes: (userJoinedNodes) => set({ userJoinedNodes }),
  setUserRequestedNodes: (userRequestedNodes) =>
    set({ userRequestedNodes: userRequestedNodes }),
  setCurrentNode: (currentNode) => set({ currentNode }),
  setNodeJoinStatus: (nodeJoinStatus) => set({ nodeJoinStatus }),
}));
