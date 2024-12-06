import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Details from "./projectDetails/detail";
export default function ViewProject({
  forumId,
  forum,
}: {
  forumId: string;
  forum: TForum;
}) {
  console.log({ hello: forumId });
  console.log({ hi: forum });
  return (
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
        <Details forumId={forumId} forum={forum} />
      </TabsContent>
      <TabsContent value="leaderboard" className="p-4">
        Leaderboard content
      </TabsContent>
      <TabsContent value="wall" className="p-4">
        Project wall content
      </TabsContent>
      <TabsContent value="faqs" className="p-4">
        FAQs content
      </TabsContent>
    </Tabs>
  );
}
