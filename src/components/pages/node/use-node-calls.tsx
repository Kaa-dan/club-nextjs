import { useCallback } from "react";
import { TNodeData, TMembers } from "@/types";
import { useNodeStore } from "@/store/nodes-store";
import { NodeEndpoints } from "@/utils/endpoints/node";
import { Endpoints } from "@/utils/endpoint";
import { useTokenStore } from "@/store/store";

interface UseNodeDataReturn {
  // Fetch operations
  fetchNodeDetails: (nodeId: string) => Promise<void>;
  fetchUserNodes: () => Promise<void>;

  // CRUD operations
  //   updateNode: (
  //     nodeId: string,
  //     nodeData: Partial<TNodeData>
  //   ) => Promise<TNodeData>;
  //   deleteNode: (nodeId: string) => Promise<void>;

  //   // Join/Leave operations
  //   joinNode: (nodeId: string) => Promise<void>;
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
    userJoinedNodes,
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

  // CRUD Operations

  //   const updateNode = useCallback(
  //     async (nodeId: string, nodeData: Partial<TNodeData>) => {
  //       try {
  //         const response = await Endpoints.updateNode(nodeId, nodeData);
  //         // Refresh node details after update
  //         if (response.data) {
  //           setCurrentNode(response.data);
  //         }
  //         return response.data;
  //       } catch (error) {
  //         console.error("Error updating node:", error);
  //         throw error;
  //       }
  //     },
  //     [setCurrentNode]
  //   );

  //   const deleteNode = useCallback(
  //     async (nodeId: string) => {
  //       try {
  //         await Endpoints.deleteNode(nodeId);
  //         // Update the local state after deletion
  //         setUserJoinedNodes(
  //           userJoinedNodes.filter((node) => node._id !== nodeId)
  //         );
  //       } catch (error) {
  //         console.error("Error deleting node:", error);
  //         throw error;
  //       }
  //     },
  //     [setUserJoinedNodes, userJoinedNodes]
  //   );

  // Join/Leave operations
  //   const joinNode = useCallback(
  //     async (nodeId: string) => {
  //       try {
  //         await Endpoints.joinNode(nodeId);
  //         await fetchUserNodes(); // Refresh the nodes list
  //       } catch (error) {
  //         console.error("Error joining node:", error);
  //         throw error;
  //       }
  //     },
  //     [fetchUserNodes]
  //   );

  const leaveNode = useCallback(
    async (nodeId: string) => {
      try {
        await Endpoints.leaveNode(nodeId);
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
    fetchUserNodes,
    // createNode,
    // updateNode,
    // deleteNode,
    // joinNode,
    leaveNode,
    error: null,
  };
};
