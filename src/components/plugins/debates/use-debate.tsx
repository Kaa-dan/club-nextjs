"use client";
import { useCallback, useState, useEffect } from "react";
import { Endpoints } from "@/utils/endpoint"; // Import Endpoints from your utils file

const useDebates = (entity: string, entityId: string) => {
  const [ongoingDebates, setOngoingDebates] = useState([]);
  const [allDebates, setAllDebates] = useState([]);
  const [globalDebates, setGlobalDebates] = useState([]);
  const [myDebates, setMyDebates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(false);
  const [proposed, setProposed] = useState([]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);

    await Promise.allSettled([
      // Fetch ongoing debates
      Endpoints.fetchOnGoingDebates(entity, entityId)
        .then((response) => {
          if (response) setOngoingDebates(response.data);
        })
        .catch((err) => {
          console.error("Error fetching ongoing debates:", err);
        }),

      // Fetch all debates
      Endpoints.fetchAllDebates(entity, entityId)
        .then((response) => {
          if (response) setAllDebates(response.ongoingDebates);
          console.log({ all: response });
        })
        .catch((err) => {
          console.error("Error fetching all debates:", err);
        }),

      // Fetch global debates
      Endpoints.fetchGlobalDebates(entity, entityId)
        .then((response) => {
          if (response) setGlobalDebates(response.data);
        })
        .catch((err) => {
          console.error("Error fetching global debates:", err);
        }),

      // Fetch my debates
      Endpoints.fetchMyDebate(entity, entityId)
        .then((response) => {
          if (response) setMyDebates(response.data);
        })
        .catch((err) => {
          console.error("Error fetching my debates:", err);
        }),
      Endpoints.fetchProposed(entityId).then((res) => {
        if (res) setProposed(res);
      }),
    ]);

    setLoading(false);
  }, [entity, entityId]);

  useEffect(() => {
    fetchAllData();
  }, [entityId, clickTrigger]);

  return {
    ongoingDebates,
    allDebates,
    globalDebates,
    myDebates,
    loading,
    refetch: fetchAllData,
    setClickTrigger,
    clickTrigger,
  };
};

export default useDebates;
