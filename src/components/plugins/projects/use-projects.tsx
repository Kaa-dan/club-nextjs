import { useCallback, useState, useEffect } from "react";
import { ProjectsEndpoints } from "@/utils/endpoints/plugins/projects";

const useProjects = (forum: TForum, forumId: string) => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [clubProjectsForChapter, setClubProjectsForChapter] = useState([]);
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
    clubProjectsForChapter: 1,
  });

  const [totalPages, setTotalPages] = useState({
    globalProjects: 1,
    allProjects: 1,
    activeProjects: 1,
    myProjects: 1,
    proposedProjects: 1,
    clubProjectsForChapter: 1,
  });

  const [projectCounts, setProjectCounts] = useState({
    activeProjects: 0,
    allProjects: 0,
    globalProjects: 0,
    myProjects: 0,
    proposedProjects: 0,
    clubProjectsForChapter: 0,
  });

  const [loading, setLoading] = useState({
    activeProjects: false,
    allProjects: false,
    globalProjects: false,
    myProjects: false,
    proposedProjects: false,
  });

  const [searchQueries, setSearchQueries] = useState({
    allProjects: "",
    activeProjects: "",
    proposedProjects: "",
    globalProjects: "",
    myProjects: "",
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
      console.log({ searchQueries });
      const response = await ProjectsEndpoints.fetchAllProjects(
        forum,
        forumId,
        "published",
        String(currentPages.allProjects),
        searchQueries.allProjects
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

  const fetchAllClubProjectsWithChapterId = useCallback(async () => {
    setLoading((prev) => ({ ...prev, allProjects: true }));
    try {
      console.log({ searchQueries });
      const response =
        await ProjectsEndpoints.fetchAllClubProjectsWithChapterId(
          forum,
          forumId,
          "published",
          String(currentPages.allProjects),
          searchQueries.allProjects
        );

      setProjectCounts((prev) => ({
        ...prev,
        clubProjectsForChapter: response?.total,
      }));

      setTotalPages((prev) => ({
        ...prev,
        clubProjectsForChapter: response?.totalPages || 1,
      }));

      console.log({ respoo: response?.projects });

      setClubProjectsForChapter(response?.projects);
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
        String(currentPages.activeProjects),
        searchQueries.allProjects
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
        String(currentPages.proposedProjects),
        searchQueries.allProjects
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
    if (forum === "chapter") return;
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
        String(currentPages.myProjects),
        searchQueries.allProjects
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

  useEffect(() => {
    fetchAllProjects();
    fetchActiveProjects();
    fetchProposedProjects();
    if (forum !== "chapter") fetchGlobalProjects();
    if (forum === "chapter") fetchAllClubProjectsWithChapterId();
    fetchMyProjects();
  }, [forumId]);

  // Effects to handle individual pagination changes
  useEffect(() => {
    fetchAllProjects();
  }, [currentPages.allProjects, searchQueries.allProjects]);

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
    setSearchQueries,
    searchQueries,
    clubProjectsForChapter,
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
