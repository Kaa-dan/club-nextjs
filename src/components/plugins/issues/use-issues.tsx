"use client";
import { IssuesEndpoints } from "@/utils/endpoints/issues";
import { useCallback, useEffect, useState } from "react";

const useIssues = (forum: TForum, nodeOrClubId: string) => {
  const [loading, setLoading] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(false);
  const [myIssues, setMyIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [liveIssues, setLiveIssues] = useState([]);
  const [globalIssues, setGlobalIssues] = useState([]);
  const [proposedIssues, setProposedIssues] = useState([]);

  console.log(forum, nodeOrClubId, "useIssues");
  const fetchAllData = useCallback(async () => {
    setLoading(true);

    await Promise.allSettled([
      //fetch myIssues
      IssuesEndpoints.fetchMyIssues(forum, nodeOrClubId)
        .then((response) => {
          if (response) setMyIssues(response);
        })
        .catch((err) => {
          console.log("Error fetching active MyIssues:", err);
        }),

      //fetch allIssues
      IssuesEndpoints.fetchAllIssues(forum, nodeOrClubId)
        .then((response) => {
          if (response) setAllIssues(response);
        })
        .catch((err) => {
          console.log("Error fetching active allIssues:", err);
        }),

      //fetch all liveIssues
      IssuesEndpoints.fetchAllLiveIssues(forum, nodeOrClubId)
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

      IssuesEndpoints.fetchProposedIssues(forum, nodeOrClubId)
        .then((response) => {
          if (response) setProposedIssues(response);
        })
        .catch((err) => {
          console.log("Error fetching proposedIssues:", err);
        }),
    ]);

    setLoading(false);
  }, [forum, nodeOrClubId]);

  useEffect(() => {
    fetchAllData();
  }, [nodeOrClubId, clickTrigger]);

  return {
    liveIssues,
    allIssues,
    globalIssues,
    myIssues,
    proposedIssues,
    refetch: fetchAllData,
    setClickTrigger,
    clickTrigger,
    loading,
  };
};

export default useIssues;
