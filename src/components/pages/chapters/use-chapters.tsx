import { withTokenAxios } from "@/lib/mainAxios";
import { useChapterStore } from "@/store/chapters-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const useChapters = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { setPublishedChapters } = useChapterStore((state) => state);

  const fetchPublishedChapters = async () => {
    try {
      const response = await withTokenAxios.get(
        `/chapters/get-published?nodeId=${nodeId}`
      );
      setPublishedChapters(response.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };
  useEffect(() => {
    fetchPublishedChapters();
  }, []);

  return {
    fetchPublishedChapters,
  };
};

export default useChapters;
