import { withTokenAxios } from "@/lib/mainAxios";
import { useChapterStore } from "@/store/chapters-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const useChapters = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { setPublishedChapters, setProposedChapters } = useChapterStore(
    (state) => state
  );

  const fetchPublishedChapters = async () => {
    try {
      const response = await withTokenAxios.get(
        `/chapters/get-published?nodeId=${nodeId}`
      );
      console.log({ response });
      setPublishedChapters(response?.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const fetchProposedChapters = async () => {
    try {
      const response = await withTokenAxios.get(
        `/chapters/get-proposed?nodeId=${nodeId}`
      );
      setProposedChapters(response?.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  useEffect(() => {
    fetchPublishedChapters();
    fetchProposedChapters();
  }, []);

  return {
    fetchPublishedChapters,
    fetchProposedChapters,
  };
};

export default useChapters;
