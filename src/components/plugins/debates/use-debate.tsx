"use client";
import { useCallback, useState, useEffect } from "react";
import { Endpoints } from "@/utils/endpoint";

const useDebates = (forum: TForum, forumId: string) => {
  // State management
  const [ongoingDebates, setOngoingDebates] = useState([]);
  const [allDebates, setAllDebates] = useState([]);
  const [globalDebates, setGlobalDebates] = useState([]);
  const [myDebates, setMyDebates] = useState([]);
  const [proposed, setProposed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(false);

  // Pagination states
  const [currentPages, setCurrentPages] = useState({
    ongoingDebates: 1,
    allDebates: 1,
    globalDebates: 1,
    myDebates: 1,
    proposed: 1,
  });

  const [totalPages, setTotalPages] = useState({
    ongoingDebates: 1,
    allDebates: 1,
    globalDebates: 1,
    myDebates: 1,
    proposed: 1,
  });

  const [debateCount, setDebateCount] = useState({
    ongoingDebates: 0,
    allDebates: 0,
    globalDebates: 0,
    myDebates: 0,
    proposed: 0,
  });

  // Individual fetch functions
  const fetchOngoingDebates = useCallback(async () => {
    try {
      const response = await Endpoints.fetchOnGoingDebates(
        forum,
        forumId,
        String(currentPages.ongoingDebates)
      );
      if (response) {
        console.log({ ok: response });
        setOngoingDebates(response.data || []);
        setTotalPages((prev) => ({
          ...prev,
          ongoingDebates: response.pagination?.totalPages || 1,
        }));
        setDebateCount((prev) => ({
          ...prev,
          ongoingDebates: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching ongoing debates:", err);
      setOngoingDebates([]);
    }
  }, [forum, forumId, currentPages.ongoingDebates]);

  const fetchAllDebates = useCallback(async () => {
    try {
      const response = await Endpoints.fetchAllDebates(
        forum,
        forumId,
        String(currentPages.allDebates)
      );
      if (response) {
        setAllDebates(response.data || []);
        setTotalPages((prev) => ({
          ...prev,
          allDebates: response.pagination?.totalPages || 1,
        }));
        setDebateCount((prev) => ({
          ...prev,
          allDebates: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching all debates:", err);
      setAllDebates([]);
    }
  }, [forum, forumId, currentPages.allDebates]);

  const fetchGlobalDebates = useCallback(async () => {
    try {
      const response = await Endpoints.fetchGlobalDebates(
        forum,
        forumId,
        String(currentPages.globalDebates)
      );
      if (response) {
        setGlobalDebates(response.data || []);
        setTotalPages((prev) => ({
          ...prev,
          globalDebates: response.pagination?.totalPages || 1,
        }));

        setDebateCount((prev) => ({
          ...prev,
          globalDebates: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching global debates:", err);
      setGlobalDebates([]);
    }
  }, [forum, forumId, currentPages.globalDebates]);

  const fetchMyDebates = useCallback(async () => {
    try {
      const response = await Endpoints.fetchMyDebate(
        forum,
        forumId,
        String(currentPages.myDebates)
      );
      if (response) {
        setMyDebates(response.data || []);
        setTotalPages((prev) => ({
          ...prev,
          myDebates: response.pagination?.totalPages || 1,
        }));

        setDebateCount((prev) => ({
          ...prev,
          myDebates: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching my debates:", err);
      setMyDebates([]);
    }
  }, [forum, forumId, currentPages.myDebates]);

  const fetchProposedDebates = useCallback(async () => {
    try {
      const response = await Endpoints.fetchProposedDebate(
        forumId,
        forum,
        String(currentPages.proposed)
      );
      if (response) {
        setProposed(response.data || []);
        setTotalPages((prev) => ({
          ...prev,
          proposed: response.pagination?.totalPages || 1,
        }));
        setDebateCount((prev) => ({
          ...prev,
          proposed: response?.pagination?.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching proposed debates:", err);
      setProposed([]);
    }
  }, [forum, forumId, currentPages.proposed]);

  // Combined fetch function
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      fetchOngoingDebates(),
      fetchAllDebates(),
      fetchGlobalDebates(),
      fetchMyDebates(),
      fetchProposedDebates(),
    ]);
    setLoading(false);
  }, [
    fetchOngoingDebates,
    fetchAllDebates,
    fetchGlobalDebates,
    fetchMyDebates,
    fetchProposedDebates,
  ]);

  // Effects for initial load and click trigger
  useEffect(() => {
    fetchAllData();
  }, [forumId, clickTrigger]);

  // Effects for pagination
  useEffect(() => {
    fetchOngoingDebates();
  }, [currentPages.ongoingDebates]);

  useEffect(() => {
    fetchAllDebates();
  }, [currentPages.allDebates]);

  useEffect(() => {
    fetchGlobalDebates();
  }, [currentPages.globalDebates]);

  useEffect(() => {
    fetchMyDebates();
  }, [currentPages.myDebates]);

  useEffect(() => {
    fetchProposedDebates();
  }, [currentPages.proposed]);

  return {
    // Data states
    ongoingDebates,
    allDebates,
    globalDebates,
    myDebates,
    proposed,
    loading,
    clickTrigger,
    setClickTrigger,
    // Pagination states
    currentPages,
    totalPages,
    setCurrentPages,
    // Refetch functions
    refetch: {
      fetchAllData,
      fetchOngoingDebates,
      fetchAllDebates,
      fetchGlobalDebates,
      fetchMyDebates,
      fetchProposedDebates,
    },
  };
};

export default useDebates;
