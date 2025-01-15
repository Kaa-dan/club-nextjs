import { Endpoints } from "@/utils/endpoint";
import { useCallback, useState, useEffect } from "react";
import { RulesAndRegulationsEndpoints } from "@/utils/endpoints/plugins/rules-and-regulations";

const useRules = (forum: TForum, forumId: string, search: string) => {
  // States for different rule types
  const [activeRules, setActiveRules] = useState([]);
  const [globalRules, setGlobalRules] = useState([]);
  const [offenses, setOffenses] = useState([]);
  const [myRules, setMyRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(false);

  // Pagination states
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

  // Fetching active rules
  const fetchActiveRules = useCallback(async () => {
    try {
      const response = await Endpoints.getActiveRules(
        forum,
        forumId,
        String(currentPages.activeRules),
        search
      );
      if (response) {
        setActiveRules(response.data);
        setTotalPages((prev) => ({
          ...prev,
          activeRules: response.pagination.totalPages || 1,
        }));
      }
    } catch (err) {
      console.error("Error fetching active rules:", err);
    }
  }, [forum, forumId, currentPages.activeRules, search]);

  // Fetching global rules
  const fetchGlobalRules = useCallback(async () => {
    try {
      const response = await Endpoints.getGlobalRules(
        String(currentPages.globalRules),
        search
      );
      if (response) {
        setGlobalRules(response.data);
        setTotalPages((prev) => ({
          ...prev,
          globalRules: response.pagination.totalPages || 1,
        }));
      }
    } catch (err) {
      console.error("Error fetching global rules:", err);
    }
  }, [currentPages.globalRules, search]);

  // Fetching offenses
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

  // Fetching single user rules
  const fetchMyRules = useCallback(async () => {
    try {
      console.log("consoling inside user rule ");
      const response =
        await RulesAndRegulationsEndpoints.fetchMyRulesOnNodeOrClub(
          forum,
          forumId,
          String(currentPages.myRules),
          search
        );
      if (response) {
        setMyRules(response.data);
        setTotalPages((prev) => ({
          ...prev,
          myRules: response.pagination.totalPages || 1,
        }));
      }
    } catch (err) {
      console.error("Error fetching my rules:", err);
    }
  }, [forum, forumId, currentPages.myRules, search]);

  // Combined fetch function
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

  // Effect for search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (search !== undefined) {
        // Fetch all searchable rule types
        Promise.all([fetchActiveRules(), fetchGlobalRules(), fetchMyRules()]);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimer);
  }, [search, fetchActiveRules, fetchGlobalRules, fetchMyRules]);

  // Effect for initial load and click trigger
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
    // Data states
    activeRules,
    globalRules,
    offenses,
    myRules,
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
      fetchActiveRules,
      fetchGlobalRules,
      fetchOffenses,
      fetchMyRules,
    },
  };
};

export default useRules;
