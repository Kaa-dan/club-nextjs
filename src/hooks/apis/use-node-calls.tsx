import { useCallback } from "react";
import { TNodeData, TMembers } from "@/types";
import { useNodeStore } from "@/store/nodes-store";
import { NodeEndpoints } from "@/utils/endpoints/node";
import { Endpoints } from "@/utils/endpoint";
import { useTokenStore } from "@/store/store";

interface UseNodeDataReturn {
  // Fetch operations
  fetchNodeDetails: (nodeId: string) => Promise<void>;
  fetchJoinedNodes: () => Promise<void>;
  fetchRequestedNodes: () => Promise<void>;
  fetchNodeJoinStatus: (nodeId: string) => Promise<void>;

  // operations
  leaveNode: (nodeId: string) => Promise<void>;

  // Error state
  error: Error | null;
}

export const useNodeCalls = (): UseNodeDataReturn => {
  const { globalUser } = useTokenStore((state) => state);
  const {
    setCurrentNode,
    setCurrentUserRole,
    setUserJoinedNodes,
    setUserRequestedNodes,
    setNodeJoinStatus,
  } = useNodeStore();

  const fetchNodeDetails = useCallback(
    async (nodeId: string) => {
      try {
        const response = await Endpoints.fetchNodeDetails(nodeId);

        const currentUserRole =
          response?.data?.members?.find(
            (member: TMembers) => member?.user?._id === globalUser?._id
          )?.role || "VISITOR";

        setCurrentUserRole(currentUserRole);
        setCurrentNode(response.data);

        return response.data;
      } catch (error) {
        console.error("Error fetching node details:", error);
        throw error;
      }
    },
    [setCurrentNode, setCurrentUserRole]
  );

  const fetchUserNodes = useCallback(async () => {
    try {
      // Fetch joined nodes
      const joinedNodes = await Endpoints.fetchUserJoinedNodes();
      setUserJoinedNodes(joinedNodes);

      // Fetch requested nodes
      const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
      setUserRequestedNodes(requestedNodes);
    } catch (error) {
      console.error("Error fetching user nodes:", error);
      throw error;
    }
  }, [setUserJoinedNodes, setUserRequestedNodes]);

  const fetchJoinedNodes = useCallback(async () => {
    try {
      const joinedNodes = await Endpoints.fetchUserJoinedNodes();
      setUserJoinedNodes(joinedNodes);
    } catch (error) {
      console.error("Error fetching joined Nodes:", error);
      throw error;
    }
  }, [setUserJoinedNodes]);

  const fetchRequestedNodes = useCallback(async () => {
    try {
      const requestedNodes =
        await await NodeEndpoints.fetchUserRequestedNodes();
      setUserRequestedNodes(requestedNodes);
    } catch (error) {
      console.error("Error fetching requested Nodes:", error);
      throw error;
    }
  }, [setUserRequestedNodes]);

  const fetchNodeJoinStatus = useCallback(
    async (nodeId: string) => {
      if (!nodeId) return;

      try {
        const response = await Endpoints.fetchNodeUserStatus(nodeId);

        setNodeJoinStatus(response?.status || "VISITOR");
        return response?.status;
      } catch (error) {
        console.error("Error fetching club details:", error);
        throw error;
      }
    },
    [setNodeJoinStatus]
  );

  // CRUD Operations
  const leaveNode = useCallback(
    async (nodeId: string) => {
      try {
        await Endpoints.leaveNode(nodeId);
        await fetchNodeJoinStatus(nodeId);
        await fetchUserNodes();
        await fetchNodeDetails(nodeId);
      } catch (error) {
        console.error("Error leaving node:", error);
        throw error;
      }
    },
    [fetchUserNodes]
  );

  return {
    fetchNodeDetails,
    fetchJoinedNodes,
    fetchRequestedNodes,
    fetchNodeJoinStatus,
    // createNode,
    // updateNode,
    // deleteNode,
    // joinNode,
    leaveNode,
    error: null,
  };
};
