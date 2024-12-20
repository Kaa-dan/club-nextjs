import { Endpoints } from "@/utils/endpoint";
import { useCallback, useState, useEffect } from "react";
import { RulesAndRegulationsEndpoints } from "@/utils/endpoints/plugins/rules-and-regulations";

const useRules = (forum: TForum, forumId: string) => {
  const [activeRules, setActiveRules] = useState([]);
  const [globalRules, setGlobalRules] = useState([]);
  const [offenses, setOffenses] = useState([]);
  const [myRules, setMyRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(false);

  const fetchAllData = useCallback(async () => {
    setLoading(true);

    await Promise.allSettled([
      Endpoints.getActiveRules(forum, forumId)
        .then((response) => {
          console.log({ rules: response });
          if (response) setActiveRules(response);
        })
        .catch((err) => {
          console.error("Error fetching active rules:", err);
        }),

      // Global Rules
      Endpoints.getGlobalRules()
        .then((response) => {
          if (response) setGlobalRules(response);
        })
        .catch((err) => {
          console.error("Error fetching global rules:", err);
        }),

      // Offences
      RulesAndRegulationsEndpoints.fetchOffeses(forum, forumId)
        .then((response) => {
          if (response) setOffenses(response);
        })
        .catch((err) => {
          console.error("Error fetching offences:", err);
        }),

      RulesAndRegulationsEndpoints.fetchMyRulesOnNodeOrClub(forum, forumId)
        .then((response) => {
          console.log({ myyyRules: response });

          if (response) setMyRules(response);
        })
        .catch((err) => {
          console.error("Error fetching offences:", err);
        }),
    ]);

    setLoading(false);
  }, [forum, forumId]);

  useEffect(() => {
    fetchAllData();
  }, [forumId, clickTrigger]);

  return {
    activeRules,
    globalRules,
    offenses,
    myRules,
    loading,
    refetch: fetchAllData,
    setClickTrigger,
    clickTrigger,
  };
};

export default useRules;
