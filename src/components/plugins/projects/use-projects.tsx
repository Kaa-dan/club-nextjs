import { useCallback, useState, useEffect } from "react";
import { ProjectsEndpoints } from "@/utils/endpoints/plugins/projects";

const useProjects = (forum: TForum, forumId: string) => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [globalProjects, setGlobalProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("usesy ");

  const fetchAllData = useCallback(async () => {
    setLoading(true);

    await Promise.allSettled([
      //   Endpoints.getActiveRules(forum, forumId)
      //     .then((response) => {
      //       console.log({ rules: response });
      //       if (response) setActiveProjects(response);
      //     })
      //     .catch((err) => {
      //       console.error("Error fetching active rules:", err);
      //     }),

      //   // Global Rules
      //   Endpoints.getGlobalRules()
      //     .then((response) => {
      //       if (response) setGlobalProjects(response);
      //     })
      //     .catch((err) => {
      //       console.error("Error fetching global rules:", err);
      //     }),

      ProjectsEndpoints.fetchAllProjects(forum, forumId)
        .then((response) => {
          console.log({ response });
          setAllProjects(response?.projects);
          setActiveProjects(response?.projects);
        })
        .catch((err) => {
          console.error("Error fetching offences:", err);
        }),
      ProjectsEndpoints.fetchMyProjects(forum, forumId)
        .then((response) => {
          console.log({ response });
          setMyProjects(response?.projects);
        })
        .catch((err) => {
          console.error("Error fetching offences:", err);
        }),
    ]);

    setLoading(false);
  }, [forum, forumId]);

  useEffect(() => {
    fetchAllData();
  }, [forumId]);

  return {
    activeProjects,
    allProjects,
    globalProjects,
    myProjects,
    loading,
    refetch: fetchAllData,
  };
};

export default useProjects;
