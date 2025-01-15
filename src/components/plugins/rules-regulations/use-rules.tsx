import { Endpoints } from "@/utils/endpoint";
import { useCallback, useState, useEffect } from "react";
import { RulesAndRegulationsEndpoints } from "@/utils/endpoints/plugins/rules-and-regulations";

const useRules = (forum: TForum, forumId: string) => {
  // Keeping existing states
  const [activeRules, setActiveRules] = useState([]);
  const [globalRules, setGlobalRules] = useState([]);
  const [offenses, setOffenses] = useState([]);
  const [myRules, setMyRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(false);

  // Adding pagination states
  const [currentPages, setCurrentPages] = useState({
    globalRules: 1,
    activeRules: 1,
    offenses: 1,
    myRules: 1,
  });

  const [totalPages, setTotalPages] = useState({
    globalRules: 1,
    activeRules: 1,
    offenses: 1,
    myRules: 1,
  });
  const [ruleCount, setRulesCount] = useState({
    globalRules: 0,
    activeRules: 0,
    offenses: 0,
    myRules: 0,
  });
  // Individual fetch functions
  const fetchActiveRules = useCallback(async () => {
    try {
      const response = await Endpoints.getActiveRules(
        forum,
        forumId,
        String(currentPages.activeRules)
      );
      if (response) {
        console.log({ response: response });
        setActiveRules(response.data);
        setTotalPages((prev) => ({
          ...prev,
          activeRules: response.pagination.totalPages || 1,
        }));
        setRulesCount((prev) => ({
          ...prev,
          activeRules: response.pagination.total,
        }));
      }
    } catch (err) {
      console.error("Error fetching active rules:", err);
    }
  }, [forum, forumId, currentPages.activeRules]);

  const fetchGlobalRules = useCallback(async () => {
    try {
      const response = await Endpoints.getGlobalRules(
        String(currentPages.globalRules)
      );
      if (response) {
        setGlobalRules(response.data);
        setTotalPages((prev) => ({
          ...prev,
          globalRules: response.pagination.totalPages || 1,
        }));

        setRulesCount((prev) => ({
          ...prev,
          globalRules: response.pagination.total,
        }));
      }
    } catch (err) {
      console.error("Error fetching global rules:", err);
    }
  }, [currentPages.globalRules]);

  const fetchOffenses = useCallback(async () => {
    try {
      const response = await RulesAndRegulationsEndpoints.fetchOffeses(
        forum,
        forumId
      );
      if (response) {
        setOffenses(response.results);
        setTotalPages((prev) => ({
          ...prev,
          offenses: response.pagination.totalPages || 1,
        }));
      }
    } catch (err) {
      console.error("Error fetching offenses:", err);
    }
  }, [forum, forumId, currentPages.offenses]);

  const fetchMyRules = useCallback(async () => {
    try {
      const response =
        await RulesAndRegulationsEndpoints.fetchMyRulesOnNodeOrClub(
          forum,
          forumId,
          String(currentPages.myRules)
        );
      if (response) {
        setMyRules(response.data);
        setTotalPages((prev) => ({
          ...prev,
          myRules: response.pagination.totalPages || 1,
        }));

        setRulesCount((prev) => ({
          ...prev,
          myRules: response.pagination.total,
        }));
      }
    } catch (err) {
      console.error("Error fetching my rules:", err);
    }
  }, [forum, forumId, currentPages.myRules]);

  // Combined fetch function (keeping existing structure)
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      fetchActiveRules(),
      fetchGlobalRules(),
      fetchOffenses(),
      fetchMyRules(),
    ]);
    setLoading(false);
  }, [fetchActiveRules, fetchGlobalRules, fetchOffenses, fetchMyRules]);

  // Effects for initial load and click trigger
  useEffect(() => {
    fetchAllData();
  }, [forumId, clickTrigger]);

  // Effects for pagination
  useEffect(() => {
    fetchActiveRules();
  }, [currentPages.activeRules]);

  useEffect(() => {
    fetchGlobalRules();
  }, [currentPages.globalRules]);

  useEffect(() => {
    fetchOffenses();
  }, [currentPages.offenses]);

  useEffect(() => {
    fetchMyRules();
  }, [currentPages.myRules]);

  return {
    // Existing returns
    activeRules,
    globalRules,
    offenses,
    myRules,
    loading,
    clickTrigger,
    setClickTrigger,
    ruleCount,
    // New pagination-related returns
    currentPages,
    totalPages,
    setCurrentPages,
    // Refetch functions
    refetch: {
      fetchAllData,
      fetchActiveRules,
      fetchGlobalRules,
      fetchOffenses,
      fetchMyRules,
    },
  };
};

export default useRules;
