"use client";
import { IssuesEndpoints } from "@/utils/endpoints/issues";
import { useCallback, useEffect, useState } from "react";

const useIssues = (section: TSections, nodeOrClubId: string) => {
  const [loading, setLoading] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(false);
  const [myIssues, setMyIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [liveIssues, setLiveIssues] = useState([]);
  const [globalIssues, setGlobalIssues] = useState([]);

  console.log(section, nodeOrClubId, "useIssues");
  const fetchAllData = useCallback(async () => {
    setLoading(true);

    await Promise.allSettled([
      //fetch myIssues
      IssuesEndpoints.fetchMyIssues(section, nodeOrClubId)
        .then((response) => {
          if (response) setMyIssues(response);
        })
        .catch((err) => {
          console.log("Error fetching active MyIssues:", err);
        }),

      //fetch allIssues
      IssuesEndpoints.fetchAllIssues(section, nodeOrClubId)
        .then((response) => {
          if (response) setAllIssues(response);
        })
        .catch((err) => {
          console.log("Error fetching active allIssues:", err);
        }),

      //fetch all liveIssues
      IssuesEndpoints.fetchAllLiveIssues(section, nodeOrClubId)
        .then((response) => {
          if (response) setLiveIssues(response);
        })
        .catch((err) => {
          console.log("Error fetching active liveIssues:", err);
        }),

      //fetch global issuess
      IssuesEndpoints.fetchGlobalIssues()
        .then((response) => {
          if (response) setGlobalIssues(response);
        })
        .catch((err) => {
          console.log("Error fetching active liveIssues:", err);
        }),
    ]);

    setLoading(false);
  }, [section, nodeOrClubId]);

  useEffect(() => {
    fetchAllData();
  }, [nodeOrClubId, clickTrigger]);

  return {
    liveIssues,
    allIssues,
    globalIssues,
    myIssues,
    refetch: fetchAllData,
    setClickTrigger,
    clickTrigger,
    loading,
  };
};

export default useIssues;
