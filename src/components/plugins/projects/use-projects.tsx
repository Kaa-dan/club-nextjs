// import { useCallback, useState, useEffect } from "react";
// import { ProjectsEndpoints } from "@/utils/endpoints/plugins/projects";

// const useProjects = (forum: TForum, forumId: string) => {
//   const [activeProjects, setActiveProjects] = useState([]);
//   const [allProjects, setAllProjects] = useState([]);
//   const [globalProjects, setGlobalProjects] = useState([]);
//   const [currentPages, setCurrentPages] = useState({
//     globalProjects: 1,
//     allProjects: 1,
//     activeProjects: 1,
//   });
//   const [myProjects, setMyProjects] = useState([]);
//   const [proposedProjects, setProposedProjects] = useState([]);
//   const [projectCounts, setProjectCounts] = useState({
//     activeProjects: 0,
//     allProjects: 0,
//     globalProjects: 0,
//     myProjects: 0,
//     proposedProjects: 0,
//   });

//   const [loading, setLoading] = useState(false);

//   // Function to transform adopted projects into project format
//   const transformAdoptedProjects = (adoptedProjects: any) => {
//     return adoptedProjects.map((adoptedProject: any) => {
//       const {
//         project,
//         club,
//         proposedBy,
//         acceptedBy,
//         status,
//         createdAt,
//         updatedAt,
//         _id,
//         type,
//         message,
//       } = adoptedProject;

//       return {
//         _id: project._id,
//         club,
//         title: project.title,
//         region: project.region,
//         budget: project.budget,
//         deadline: project.deadline,
//         significance: project.significance,
//         solution: project.solution,
//         bannerImage: project.bannerImage,
//         committees: project.committees,
//         champions: project.champions,
//         aboutPromoters: project.aboutPromoters,
//         fundingDetails: project.fundingDetails,
//         keyTakeaways: project.keyTakeaways,
//         risksAndChallenges: project.risksAndChallenges,
//         status: status,
//         files: project.files,
//         createdBy: proposedBy,
//         publishedBy: acceptedBy,
//         createdAt: createdAt,
//         updatedAt: updatedAt,
//         adoptedId: _id,
//         type,
//         message,
//       };
//     });
//   };

//   const sortProjects = (projects: any) => {
//     return projects.sort((a: any, b: any) => {
//       const dateA: any = new Date(a.createdAt);
//       const dateB: any = new Date(b.createdAt);
//       return dateB - dateA;
//     });
//   };

//   // Example usage:

//   const fetchAllData = useCallback(async () => {
//     setLoading(true);

//     await Promise.allSettled([
//       ProjectsEndpoints.fetchAllProjects(forum, forumId, "published")
//         .then((response: any) => {
//           console.log({ response });
//           const combined: any = sortProjects([
//             ...response?.projects,
//             ...transformAdoptedProjects(response?.adoptedProjects),
//           ]);
//           setProjectCounts((p) => ({
//             ...p,
//             allProjects: response?.total + response?.adoptedProjects?.length,
//             activeProjects: response?.total + response?.adoptedProjects?.length,
//           }));

//           console.log(
//             "booo ",
//             response?.total + response?.adoptedProjects?.length
//           );
//           setAllProjects(combined);
//           setActiveProjects(combined);
//         })
//         .catch((err) => {
//           console.error("Error fetching offences:", err);
//         }),
//       ProjectsEndpoints.fetchAllProjects(forum, forumId, "proposed")
//         .then((response) => {
//           console.log({ response });
//           // setAllProjects(response?.projects);
//           const combined: any = sortProjects([
//             ...response?.projects,
//             ...transformAdoptedProjects(response?.adoptedProjects),
//           ]);
//           setProjectCounts((p) => ({
//             ...p,
//             proposedProjects:
//               response?.total + response?.adoptedProjects?.length,
//           }));
//           setProposedProjects(combined);
//         })
//         .catch((err) => {
//           console.error("Error fetching offences:", err);
//         }),
//       ProjectsEndpoints.fetchGlobalProjects(
//         String(currentPages?.globalProjects) || "1"
//       )
//         .then((response) => {
//           console.log({ glob: response });
//           const combined: any = sortProjects(response?.projects);
//           setProjectCounts((p) => ({
//             ...p,
//             globalProjects: response?.total,
//           }));
//           setGlobalProjects(response?.projects);
//         })
//         .catch((err) => {
//           console.error("Error fetching offences:", err);
//         }),
//       ProjectsEndpoints.fetchMyProjects(forum, forumId).then((res) => {
//         const combined: any = sortProjects([
//           ...res?.projects,
//           ...transformAdoptedProjects(res?.adoptedProjects),
//         ]);

//         console.log({ myyy: combined });
//         setProjectCounts((p) => ({
//           ...p,
//           myProjects: res?.total + res?.adoptedProjects?.length,
//         }));
//         setMyProjects(combined);
//       }),
//     ]);

//     setLoading(false);
//   }, [forum, forumId]);

//   useEffect(() => {
//     fetchAllData();
//   }, [forumId, currentPages]);

//   return {
//     activeProjects,
//     allProjects,
//     globalProjects,
//     myProjects,
//     loading,
//     proposedProjects,
//     projectCounts,
//     currentPages,
//     setCurrentPages,
//     refetch: fetchAllData,
//   };
// };

// export default useProjects;

// import { useCallback, useState, useEffect } from "react";
// import { ProjectsEndpoints } from "@/utils/endpoints/plugins/projects";

// const useProjects = (forum: TForum, forumId: string) => {
//   const [activeProjects, setActiveProjects] = useState([]);
//   const [allProjects, setAllProjects] = useState([]);
//   const [globalProjects, setGlobalProjects] = useState([]);
//   const [myProjects, setMyProjects] = useState([]);
//   const [proposedProjects, setProposedProjects] = useState([]);

//   const [currentPages, setCurrentPages] = useState({
//     globalProjects: 1,
//     allProjects: 1,
//     activeProjects: 1,
//     myProjects: 1,
//     proposedProjects: 1,
//   });

//   const [projectCounts, setProjectCounts] = useState({
//     activeProjects: 0,
//     allProjects: 0,
//     globalProjects: 0,
//     myProjects: 0,
//     proposedProjects: 0,
//   });

//   const [loading, setLoading] = useState({
//     activeProjects: false,
//     allProjects: false,
//     globalProjects: false,
//     myProjects: false,
//     proposedProjects: false,
//   });

//   // Helper function to transform adopted projects
//   const transformAdoptedProjects = (adoptedProjects: any) => {
//     return adoptedProjects.map((adoptedProject: any) => {
//       const {
//         project,
//         club,
//         proposedBy,
//         acceptedBy,
//         status,
//         createdAt,
//         updatedAt,
//         _id,
//         type,
//         message,
//       } = adoptedProject;

//       return {
//         _id: project._id,
//         club,
//         title: project.title,
//         region: project.region,
//         budget: project.budget,
//         deadline: project.deadline,
//         significance: project.significance,
//         solution: project.solution,
//         bannerImage: project.bannerImage,
//         committees: project.committees,
//         champions: project.champions,
//         aboutPromoters: project.aboutPromoters,
//         fundingDetails: project.fundingDetails,
//         keyTakeaways: project.keyTakeaways,
//         risksAndChallenges: project.risksAndChallenges,
//         status: status,
//         files: project.files,
//         createdBy: proposedBy,
//         publishedBy: acceptedBy,
//         createdAt: createdAt,
//         updatedAt: updatedAt,
//         adoptedId: _id,
//         type,
//         message,
//       };
//     });
//   };

//   const sortProjects = (projects: any) => {
//     return projects.sort((a: any, b: any) => {
//       const dateA: any = new Date(a.createdAt);
//       const dateB: any = new Date(b.createdAt);
//       return dateB - dateA;
//     });
//   };

//   // Individual fetch functions
//   const fetchAllProjects = useCallback(async () => {
//     setLoading((prev) => ({ ...prev, allProjects: true }));
//     try {
//       const response = await ProjectsEndpoints.fetchAllProjects(
//         forum,
//         forumId,
//         "published",
//         String(currentPages.allProjects)
//       );

//       const combined = sortProjects([
//         ...response?.projects,
//         ...transformAdoptedProjects(response?.adoptedProjects),
//       ]);

//       setProjectCounts((prev) => ({
//         ...prev,
//         allProjects: response?.total + response?.adoptedProjects?.length,
//       }));

//       setAllProjects(combined);
//     } catch (err) {
//       console.error("Error fetching all projects:", err);
//     } finally {
//       setLoading((prev) => ({ ...prev, allProjects: false }));
//     }
//   }, [forum, forumId, currentPages.allProjects]);

//   const fetchActiveProjects = useCallback(async () => {
//     setLoading((prev) => ({ ...prev, activeProjects: true }));
//     try {
//       const response = await ProjectsEndpoints.fetchAllProjects(
//         forum,
//         forumId,
//         "published",
//         String(currentPages.activeProjects)
//       );

//       const combined = sortProjects([
//         ...response?.projects,
//         ...transformAdoptedProjects(response?.adoptedProjects),
//       ]);

//       setProjectCounts((prev) => ({
//         ...prev,
//         activeProjects: response?.total + response?.adoptedProjects?.length,
//       }));

//       setActiveProjects(combined);
//     } catch (err) {
//       console.error("Error fetching active projects:", err);
//     } finally {
//       setLoading((prev) => ({ ...prev, activeProjects: false }));
//     }
//   }, [forum, forumId, currentPages.activeProjects]);

//   const fetchProposedProjects = useCallback(async () => {
//     setLoading((prev) => ({ ...prev, proposedProjects: true }));
//     try {
//       const response = await ProjectsEndpoints.fetchAllProjects(
//         forum,
//         forumId,
//         "proposed",
//         String(currentPages.proposedProjects)
//       );

//       const combined = sortProjects([
//         ...response?.projects,
//         ...transformAdoptedProjects(response?.adoptedProjects),
//       ]);

//       setProjectCounts((prev) => ({
//         ...prev,
//         proposedProjects: response?.total + response?.adoptedProjects?.length,
//       }));

//       setProposedProjects(combined);
//     } catch (err) {
//       console.error("Error fetching proposed projects:", err);
//     } finally {
//       setLoading((prev) => ({ ...prev, proposedProjects: false }));
//     }
//   }, [forum, forumId, currentPages.proposedProjects]);

//   const fetchGlobalProjects = useCallback(async () => {
//     setLoading((prev) => ({ ...prev, globalProjects: true }));
//     try {
//       const response = await ProjectsEndpoints.fetchGlobalProjects(
//         String(currentPages.globalProjects)
//       );

//       const combined = sortProjects(response?.projects);

//       setProjectCounts((prev) => ({
//         ...prev,
//         globalProjects: response?.total,
//       }));

//       setGlobalProjects(response?.projects);
//     } catch (err) {
//       console.error("Error fetching global projects:", err);
//     } finally {
//       setLoading((prev) => ({ ...prev, globalProjects: false }));
//     }
//   }, [currentPages.globalProjects]);

//   const fetchMyProjects = useCallback(async () => {
//     setLoading((prev) => ({ ...prev, myProjects: true }));
//     try {
//       const response = await ProjectsEndpoints.fetchMyProjects(
//         forum,
//         forumId,
//         String(currentPages.myProjects)
//       );

//       const combined = sortProjects([
//         ...response?.projects,
//         ...transformAdoptedProjects(response?.adoptedProjects),
//       ]);

//       setProjectCounts((prev) => ({
//         ...prev,
//         myProjects: response?.total + response?.adoptedProjects?.length,
//       }));

//       setMyProjects(combined);
//     } catch (err) {
//       console.error("Error fetching my projects:", err);
//     } finally {
//       setLoading((prev) => ({ ...prev, myProjects: false }));
//     }
//   }, [forum, forumId, currentPages.myProjects]);

//   // Effect to fetch data when component mounts
//   useEffect(() => {
//     fetchAllProjects();
//     fetchActiveProjects();
//     fetchProposedProjects();
//     fetchGlobalProjects();
//     fetchMyProjects();
//   }, [forumId]);

//   // Effects to handle individual pagination changes
//   useEffect(() => {
//     fetchAllProjects();
//   }, [currentPages.allProjects]);

//   useEffect(() => {
//     fetchActiveProjects();
//   }, [currentPages.activeProjects]);

//   useEffect(() => {
//     fetchProposedProjects();
//   }, [currentPages.proposedProjects]);

//   useEffect(() => {
//     fetchGlobalProjects();
//   }, [currentPages.globalProjects]);

//   useEffect(() => {
//     fetchMyProjects();
//   }, [currentPages.myProjects]);

//   return {
//     activeProjects,
//     allProjects,
//     globalProjects,
//     myProjects,
//     proposedProjects,
//     projectCounts,
//     currentPages,
//     loading,
//     setCurrentPages,
//     refetch: {
//       fetchAllProjects,
//       fetchActiveProjects,
//       fetchProposedProjects,
//       fetchGlobalProjects,
//       fetchMyProjects,
//     },
//   };
// };

// export default useProjects;

import { useCallback, useState, useEffect } from "react";
import { ProjectsEndpoints } from "@/utils/endpoints/plugins/projects";

const useProjects = (forum: TForum, forumId: string) => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [globalProjects, setGlobalProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [proposedProjects, setProposedProjects] = useState([]);

  const [currentPages, setCurrentPages] = useState({
    globalProjects: 1,
    allProjects: 1,
    activeProjects: 1,
    myProjects: 1,
    proposedProjects: 1,
  });

  const [totalPages, setTotalPages] = useState({
    globalProjects: 1,
    allProjects: 1,
    activeProjects: 1,
    myProjects: 1,
    proposedProjects: 1,
  });

  const [projectCounts, setProjectCounts] = useState({
    activeProjects: 0,
    allProjects: 0,
    globalProjects: 0,
    myProjects: 0,
    proposedProjects: 0,
  });

  const [loading, setLoading] = useState({
    activeProjects: false,
    allProjects: false,
    globalProjects: false,
    myProjects: false,
    proposedProjects: false,
  });

  // Helper function to transform adopted projects
  const transformAdoptedProjects = (adoptedProjects: any) => {
    return adoptedProjects.map((adoptedProject: any) => {
      const {
        project,
        club,
        proposedBy,
        acceptedBy,
        status,
        createdAt,
        updatedAt,
        _id,
        type,
        message,
      } = adoptedProject;

      return {
        _id: project._id,
        club,
        title: project.title,
        region: project.region,
        budget: project.budget,
        deadline: project.deadline,
        significance: project.significance,
        solution: project.solution,
        bannerImage: project.bannerImage,
        committees: project.committees,
        champions: project.champions,
        aboutPromoters: project.aboutPromoters,
        fundingDetails: project.fundingDetails,
        keyTakeaways: project.keyTakeaways,
        risksAndChallenges: project.risksAndChallenges,
        status: status,
        files: project.files,
        createdBy: proposedBy,
        publishedBy: acceptedBy,
        createdAt: createdAt,
        updatedAt: updatedAt,
        adoptedId: _id,
        type,
        message,
      };
    });
  };

  const sortProjects = (projects: any) => {
    return projects.sort((a: any, b: any) => {
      const dateA: any = new Date(a.createdAt);
      const dateB: any = new Date(b.createdAt);
      return dateB - dateA;
    });
  };

  // Individual fetch functions
  const fetchAllProjects = useCallback(async () => {
    setLoading((prev) => ({ ...prev, allProjects: true }));
    try {
      const response = await ProjectsEndpoints.fetchAllProjects(
        forum,
        forumId,
        "published",
        String(currentPages.allProjects)
      );

      const combined = sortProjects([
        ...response?.projects,
        ...transformAdoptedProjects(response?.adoptedProjects),
      ]);

      setProjectCounts((prev) => ({
        ...prev,
        allProjects: response?.total + response?.adoptedProjects?.length,
      }));

      setTotalPages((prev) => ({
        ...prev,
        allProjects: response?.totalPages || 1,
      }));

      setAllProjects(combined);
    } catch (err) {
      console.error("Error fetching all projects:", err);
    } finally {
      setLoading((prev) => ({ ...prev, allProjects: false }));
    }
  }, [forum, forumId, currentPages.allProjects]);

  const fetchActiveProjects = useCallback(async () => {
    setLoading((prev) => ({ ...prev, activeProjects: true }));
    try {
      const response = await ProjectsEndpoints.fetchAllProjects(
        forum,
        forumId,
        "published",
        String(currentPages.activeProjects)
      );

      const combined = sortProjects([
        ...response?.projects,
        ...transformAdoptedProjects(response?.adoptedProjects),
      ]);

      setProjectCounts((prev) => ({
        ...prev,
        activeProjects: response?.total + response?.adoptedProjects?.length,
      }));

      setTotalPages((prev) => ({
        ...prev,
        activeProjects: response?.totalPages || 1,
      }));

      setActiveProjects(combined);
    } catch (err) {
      console.error("Error fetching active projects:", err);
    } finally {
      setLoading((prev) => ({ ...prev, activeProjects: false }));
    }
  }, [forum, forumId, currentPages.activeProjects]);

  const fetchProposedProjects = useCallback(async () => {
    setLoading((prev) => ({ ...prev, proposedProjects: true }));
    try {
      const response = await ProjectsEndpoints.fetchAllProjects(
        forum,
        forumId,
        "proposed",
        String(currentPages.proposedProjects)
      );

      const combined = sortProjects([
        ...response?.projects,
        ...transformAdoptedProjects(response?.adoptedProjects),
      ]);

      setProjectCounts((prev) => ({
        ...prev,
        proposedProjects: response?.total + response?.adoptedProjects?.length,
      }));

      setTotalPages((prev) => ({
        ...prev,
        proposedProjects: response?.totalPages || 1,
      }));

      setProposedProjects(combined);
    } catch (err) {
      console.error("Error fetching proposed projects:", err);
    } finally {
      setLoading((prev) => ({ ...prev, proposedProjects: false }));
    }
  }, [forum, forumId, currentPages.proposedProjects]);

  const fetchGlobalProjects = useCallback(async () => {
    setLoading((prev) => ({ ...prev, globalProjects: true }));
    try {
      const response = await ProjectsEndpoints.fetchGlobalProjects(
        String(currentPages.globalProjects)
      );

      const combined = sortProjects(response?.projects);

      setProjectCounts((prev) => ({
        ...prev,
        globalProjects: response?.total,
      }));

      setTotalPages((prev) => ({
        ...prev,
        globalProjects: response?.totalPages || 1,
      }));

      setGlobalProjects(response?.projects);
    } catch (err) {
      console.error("Error fetching global projects:", err);
    } finally {
      setLoading((prev) => ({ ...prev, globalProjects: false }));
    }
  }, [currentPages.globalProjects]);

  const fetchMyProjects = useCallback(async () => {
    setLoading((prev) => ({ ...prev, myProjects: true }));
    try {
      const response = await ProjectsEndpoints.fetchMyProjects(
        forum,
        forumId,
        String(currentPages.myProjects)
      );

      const combined = sortProjects([
        ...response?.projects,
        ...transformAdoptedProjects(response?.adoptedProjects),
      ]);

      setProjectCounts((prev) => ({
        ...prev,
        myProjects: response?.total + response?.adoptedProjects?.length,
      }));

      setTotalPages((prev) => ({
        ...prev,
        myProjects: response?.totalPages || 1,
      }));

      setMyProjects(combined);
    } catch (err) {
      console.error("Error fetching my projects:", err);
    } finally {
      setLoading((prev) => ({ ...prev, myProjects: false }));
    }
  }, [forum, forumId, currentPages.myProjects]);

  // Effect to fetch data when component mounts
  useEffect(() => {
    fetchAllProjects();
    fetchActiveProjects();
    fetchProposedProjects();
    fetchGlobalProjects();
    fetchMyProjects();
  }, [forumId]);

  // Effects to handle individual pagination changes
  useEffect(() => {
    fetchAllProjects();
  }, [currentPages.allProjects]);

  useEffect(() => {
    fetchActiveProjects();
  }, [currentPages.activeProjects]);

  useEffect(() => {
    fetchProposedProjects();
  }, [currentPages.proposedProjects]);

  useEffect(() => {
    fetchGlobalProjects();
  }, [currentPages.globalProjects]);

  useEffect(() => {
    fetchMyProjects();
  }, [currentPages.myProjects]);

  return {
    activeProjects,
    allProjects,
    globalProjects,
    myProjects,
    proposedProjects,
    projectCounts,
    currentPages,
    totalPages,
    loading,
    setCurrentPages,
    refetch: {
      fetchAllProjects,
      fetchActiveProjects,
      fetchProposedProjects,
      fetchGlobalProjects,
      fetchMyProjects,
    },
  };
};

export default useProjects;
