"use client";

import { useCallback, useState, useEffect } from "react";
import { IssuesEndpoints } from "@/utils/endpoints/issues";

const useIssues = (forum: TForum, forumId: string) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(false);
  const [myIssues, setMyIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [liveIssues, setLiveIssues] = useState([]);
  const [globalIssues, setGlobalIssues] = useState([]);
  const [proposedIssues, setProposedIssues] = useState([]);

  // Pagination states
  const [currentPages, setCurrentPages] = useState({
    myIssues: 1,
    allIssues: 1,
    liveIssues: 1,
    globalIssues: 1,
    proposedIssues: 1,
  });

  const [totalPages, setTotalPages] = useState({
    myIssues: 1,
    allIssues: 1,
    liveIssues: 1,
    globalIssues: 1,
    proposedIssues: 1,
  });

  const [issueCount, setIssueCount] = useState({
    myIssues: 0,
    allIssues: 0,
    liveIssues: 0,
    globalIssues: 0,
    proposedIssues: 0,
  });
  // Individual fetch functions
  const fetchMyIssues = useCallback(async () => {
    try {
      const response = await IssuesEndpoints.fetchMyIssues(
        forum,
        forumId,
        String(currentPages.myIssues)
      );
      if (response) {
        setMyIssues(response.issues || []);
        setTotalPages((prev) => ({
          ...prev,
          myIssues: response.pagination?.totalPages || 1,
        }));

        setIssueCount((prev) => ({
          ...prev,
          myIssues: response.pagination.totalItems,
        }));
      }
    } catch (err) {
      console.error("Error fetching my issues:", err);
      setMyIssues([]);
    }
  }, [forum, forumId, currentPages.myIssues]);

  const fetchAllIssues = useCallback(async () => {
    try {
      const response = await IssuesEndpoints.fetchAllIssues(
        forum,
        forumId,
        String(currentPages.allIssues)
      );
      if (response) {
        setAllIssues(response.issues || []);
        setTotalPages((prev) => ({
          ...prev,
          allIssues: response.pagination?.totalPages || 1,
        }));
        setIssueCount((prev) => ({
          ...prev,
          allIssues: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching all issues:", err);
      setAllIssues([]);
    }
  }, [forum, forumId, currentPages.allIssues]);

  const fetchLiveIssues = useCallback(async () => {
    try {
      const response = await IssuesEndpoints.fetchAllLiveIssues(
        forum,
        forumId,
        String(currentPages.liveIssues)
      );
      if (response) {
        setLiveIssues(response.issues || []);
        setTotalPages((prev) => ({
          ...prev,
          liveIssues: response.pagination?.totalPages || 1,
        }));

        setIssueCount((prev) => ({
          ...prev,
          liveIssues: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching live issues:", err);
      setLiveIssues([]);
    }
  }, [forum, forumId, currentPages.liveIssues]);

  const fetchGlobalIssues = useCallback(async () => {
    try {
      const response = await IssuesEndpoints.fetchGlobalIssues(
        String(currentPages.globalIssues)
      );
      if (response) {
        setGlobalIssues(response.issues || []);
        setTotalPages((prev) => ({
          ...prev,
          globalIssues: response.pagination?.totalPages || 1,
        }));

        setIssueCount((prev) => ({
          ...prev,
          globalIssues: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching global issues:", err);
      setGlobalIssues([]);
    }
  }, [currentPages.globalIssues]);

  const fetchProposedIssues = useCallback(async () => {
    try {
      const response = await IssuesEndpoints.fetchProposedIssues(
        forum,
        forumId,
        String(currentPages.proposedIssues)
      );
      if (response) {
        setProposedIssues(response.issues || []);
        setTotalPages((prev) => ({
          ...prev,
          proposedIssues: response.pagination?.totalPages || 1,
        }));

        setIssueCount((prev) => ({
          ...prev,
          proposedIssues: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching proposed issues:", err);
      setProposedIssues([]);
    }
  }, [forum, forumId, currentPages.proposedIssues]);

  // Combined fetch function
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      fetchMyIssues(),
      fetchAllIssues(),
      fetchLiveIssues(),
      fetchGlobalIssues(),
      fetchProposedIssues(),
    ]);
    setLoading(false);
  }, [
    fetchMyIssues,
    fetchAllIssues,
    fetchLiveIssues,
    fetchGlobalIssues,
    fetchProposedIssues,
  ]);

  // Effects for initial load and click trigger
  useEffect(() => {
    fetchAllData();
  }, [forumId, clickTrigger]);

  // Effects for pagination
  useEffect(() => {
    fetchMyIssues();
  }, [currentPages.myIssues]);

  useEffect(() => {
    fetchAllIssues();
  }, [currentPages.allIssues]);

  useEffect(() => {
    fetchLiveIssues();
  }, [currentPages.liveIssues]);

  useEffect(() => {
    fetchGlobalIssues();
  }, [currentPages.globalIssues]);

  useEffect(() => {
    fetchProposedIssues();
  }, [currentPages.proposedIssues]);

  return {
    // Data states
    myIssues,
    allIssues,
    liveIssues,
    globalIssues,
    proposedIssues,
    loading,
    clickTrigger,
    setClickTrigger,
    issueCount,
    // Pagination states
    currentPages,
    totalPages,
    setCurrentPages,
    // Refetch functions
    refetch: {
      fetchAllData,
      fetchMyIssues,
      fetchAllIssues,
      fetchLiveIssues,
      fetchGlobalIssues,
      fetchProposedIssues,
    },
  };
};

export default useIssues;
