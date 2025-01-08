import { withTokenAxios } from "@/lib/mainAxios";
import { useChapterStore } from "@/store/chapters-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const useChapters = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const { setPublishedChapters, setProposedChapters, setRejectedChapters } =
    useChapterStore((state) => state);

  const fetchPublishedChapters = async () => {
    try {
      const response = await withTokenAxios.get(
        `/chapters/get-published?nodeId=${nodeId}`
      );
      console.log({ response });
      setPublishedChapters(response?.data);
    } catch (error) {
      console.error("Error fetching published chapters:", error);
    }
  };

  const fetchProposedChapters = async () => {
    try {
      const response = await withTokenAxios.get(
        `/chapters/get-proposed?nodeId=${nodeId}`
      );
      setProposedChapters(response?.data);
    } catch (error) {
      console.error("Error fetching proposed chapters:", error);
    }
  };

  const fetchRejectedChapters = async () => {
    try {
      const response = await withTokenAxios.get(
        `/chapters/get-rejected?nodeId=${nodeId}`
      );
      setRejectedChapters(response?.data);
    } catch (error) {
      console.log("Error fetching rejected chapters:", error);
    }
  };

  useEffect(() => {
    fetchPublishedChapters();
    fetchProposedChapters();
    fetchRejectedChapters();
  }, []);

  return {
    fetchPublishedChapters,
    fetchProposedChapters,
    fetchRejectedChapters,
  };
};

export default useChapters;
