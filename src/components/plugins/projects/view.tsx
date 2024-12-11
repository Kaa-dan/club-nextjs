"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Details from "./projectDetails/detail";
import CommentsSection from "@/components/globals/comments/comments-section";
import { useParams } from "next/navigation";
import FAQList from "./faq-list";
import { useEffect, useState } from "react";
import { ProjectApi } from "./projectApi";
import ProjectWall from "./project-wall";
import LeaderBoard from "./projectDetails/leader-board";
export default function ViewProject({
  forumId,
  forum,
}: {
  forumId: string;
  forum: TForum;
}) {
  const [project, setProject] = useState<TProjectData>();
  const { postId, plugin } = useParams<{
    plugin: TPlugins;
    postId: string;
  }>();

  useEffect(() => {
    if (postId)
      ProjectApi.singleView(postId).then((res) => {
        setProject(res);
      });
  }, [postId]);
  return (
    <>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="h-auto border-b bg-transparent p-0">
          <TabsTrigger
            value="details"
            className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Project Details
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="wall"
            className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Project Wall
          </TabsTrigger>
          <TabsTrigger
            value="faqs"
            className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            FAQs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="p-4">
          <Details project={project} forumId={forumId} forum={forum} />
        </TabsContent>
        <TabsContent value="leaderboard" className="p-4">
          <LeaderBoard />
        </TabsContent>
        <TabsContent value="wall" className="p-4">
          <ProjectWall />
        </TabsContent>
        <TabsContent value="faqs" className="p-4">
          <FAQList faqs={project?.faqs!} />
        </TabsContent>
      </Tabs>
      <CommentsSection plugin={plugin} postId={postId} />
    </>
  );
}
