import { useCallback, useState, useEffect } from "react";
import { ProjectsEndpoints } from "@/utils/endpoints/plugins/projects";

const useProjects = (forum: TForum, forumId: string) => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [globalProjects, setGlobalProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [proposedProjects, setProposedProjects] = useState([]);
  const [projectCounts, setProjectCounts] = useState({
    activeProjects: 0,
    allProjects: 0,
    globalProjects: 0,
    myProjects: 0,
    proposedProjects: 0,
  });

  const [loading, setLoading] = useState(false);

  // Function to transform adopted projects into project format
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

  // Example usage:

  const fetchAllData = useCallback(async () => {
    setLoading(true);

    await Promise.allSettled([
      ProjectsEndpoints.fetchAllProjects(forum, forumId, "published")
        .then((response: any) => {
          console.log({ response });
          const combined: any = sortProjects([
            ...response?.projects,
            ...transformAdoptedProjects(response?.adoptedProjects),
          ]);
          setProjectCounts((p) => ({
            ...p,
            allProjects: response?.total + response?.adoptedProjects?.length,
            activeProjects: response?.total + response?.adoptedProjects?.length,
          }));

          console.log(
            "booo ",
            response?.total + response?.adoptedProjects?.length
          );
          setAllProjects(combined);
          setActiveProjects(combined);
        })
        .catch((err) => {
          console.error("Error fetching offences:", err);
        }),
      ProjectsEndpoints.fetchAllProjects(forum, forumId, "proposed")
        .then((response) => {
          console.log({ response });
          // setAllProjects(response?.projects);
          const combined: any = sortProjects([
            ...response?.projects,
            ...transformAdoptedProjects(response?.adoptedProjects),
          ]);
          setProjectCounts((p) => ({
            ...p,
            proposedProjects:
              response?.total + response?.adoptedProjects?.length,
          }));
          setProposedProjects(combined);
        })
        .catch((err) => {
          console.error("Error fetching offences:", err);
        }),
      ProjectsEndpoints.fetchGlobalProjects()
        .then((response) => {
          console.log({ glob: response });
          const combined: any = sortProjects(response?.projects);
          setProjectCounts((p) => ({
            ...p,
            globalProjects: response?.total,
          }));
          setGlobalProjects(response?.projects);
        })
        .catch((err) => {
          console.error("Error fetching offences:", err);
        }),
      ProjectsEndpoints.fetchMyProjects(forum, forumId).then((res) => {
        const combined: any = sortProjects([
          ...res?.projects,
          ...transformAdoptedProjects(res?.adoptedProjects),
        ]);

        console.log({ myyy: combined });
        setProjectCounts((p) => ({
          ...p,
          myProjects: res?.total + res?.adoptedProjects?.length,
        }));
        setMyProjects(combined);
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
    proposedProjects,
    projectCounts,
    refetch: fetchAllData,
  };
};

export default useProjects;
