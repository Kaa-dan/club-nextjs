import { useCallback } from "react";
import { TMembers } from "@/types";
import { useClubStore } from "@/store/clubs-store";
import { Endpoints } from "@/utils/endpoint";
import { ClubEndpoints } from "@/utils/endpoints/club";
import { fetchSpecificClub } from "./endpoint";
import { toast } from "sonner";
import { useTokenStore } from "@/store/store";

interface UseClubCallsReturn {
  // Fetch operations
  fetchClubDetails: (clubId: string) => Promise<void>;
  fetchJoinedClubs: () => Promise<void>;
  fetchRequestedClubs: () => Promise<void>;

  // operations
  leaveClub: (clubId: string) => Promise<void>;

  // Error state
  error: Error | null;
}

export const useClubCalls = (): UseClubCallsReturn => {
  const { globalUser } = useTokenStore((state) => state);

  const {
    setCurrentClub,
    setCurrentUserRole,
    setUserJoinedClubs,
    setUserRequestedClubs,
  } = useClubStore();

  const fetchClubDetails = useCallback(
    async (clubId: string) => {
      if (!clubId) return;

      try {
        const response = await fetchSpecificClub(clubId);

        const currentUserRole =
          response?.members?.find(
            (member: TMembers) => member?.user?._id === globalUser?._id
          )?.role || "VISITOR";

        setCurrentUserRole(currentUserRole);
        setCurrentClub(response);

        return response;
      } catch (error) {
        console.error("Error fetching club details:", error);
        throw error;
      }
    },
    [setCurrentClub, setCurrentUserRole]
  );

  const fetchJoinedClubs = useCallback(async () => {
    try {
      const joinedClubs = await Endpoints.fetchUserJoinedClubs();
      setUserJoinedClubs(joinedClubs);
    } catch (error) {
      console.error("Error fetching joined clubs:", error);
      throw error;
    }
  }, [setUserJoinedClubs]);

  const fetchRequestedClubs = useCallback(async () => {
    try {
      const requestedClubs = await ClubEndpoints.fetchUserRequestedClubs();
      setUserRequestedClubs(requestedClubs);
    } catch (error) {
      console.error("Error fetching requested clubs:", error);
      throw error;
    }
  }, [setUserRequestedClubs]);

  // Membership operations
  const leaveClub = useCallback(
    async (clubId: string) => {
      try {
        const response = await Endpoints.leaveClub(clubId);
        await fetchJoinedClubs(); // Refresh the clubs list
        toast.warning(response.message);
      } catch (error) {
        toast.error("Failed to leave club");
        console.error("Error leaving club:", error);
        throw error;
      }
    },
    [fetchJoinedClubs]
  );

  return {
    fetchClubDetails,
    fetchRequestedClubs,
    fetchJoinedClubs,
    leaveClub,
    error: null,
  };
};
