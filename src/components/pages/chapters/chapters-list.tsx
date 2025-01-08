"use client";

import * as React from "react";
import { Check, Eye, Filter, Search, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateChapterModal from "./create-chapter-modal";
import Image from "next/image";
import { withTokenAxios } from "@/lib/mainAxios";
import { useParams } from "next/navigation";
import { TChapter } from "@/types";
import { useChapterStore } from "@/store/chapters-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useChapters from "./use-chapters";
import { toast } from "sonner";
import { usePermission } from "@/lib/use-permission";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ChaptersList() {
  const { hasPermission } = usePermission();
  const { nodeId } = useParams<{ nodeId: string }>();
  const { fetchPublishedChapters, fetchProposedChapters } = useChapters();
  const { publishedChapters, proposedChapters } = useChapterStore(
    (state) => state
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [chapters, setChapters] = React.useState<TChapter[]>([]);
  const [filteredPublishedChapters, setFilteredPublishedChapters] =
    React.useState<TChapter[]>(publishedChapters);
  const [filteredProposedChapters, setFilteredProposedChapters] =
    React.useState<TChapter[]>(proposedChapters);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [isReasonModelOpen, setIsReasonModelOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    const filteredPublished = publishedChapters.filter((chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredProposed = proposedChapters.filter((chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredPublishedChapters(filteredPublished);
    setFilteredProposedChapters(filteredProposed);
  }, [searchQuery, chapters, publishedChapters, proposedChapters]);

  const handleChapterApproval = async (
    chapterId: string,
    status: "publish" | "reject"
  ) => {
    try {
      if (status === "reject" && reason?.trim() === "") {
        toast.error("Please provide a reason for rejecting this chapter");
        return;
      }

      const postData: {
        chapterId: string;
        status: "publish" | "reject";
        node: string;
        reason?: string;
      } = {
        chapterId,
        status,
        node: nodeId,
      };

      if (status === "reject") {
        postData.reason = reason?.trim();
      }

      console.log(postData, "postData");

      await withTokenAxios.post("/chapters/publish-or-reject", postData);
      fetchPublishedChapters();
      fetchProposedChapters();
    } catch (error: any) {
      const message =
        status === "publish"
          ? "something went wrong when publishing chapter"
          : "something went wrong when rejecting chapter";
      toast.error(error.response.data.message || message);
      console.log(error.message);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search for chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Filter by Date</DropdownMenuItem>
            <DropdownMenuItem>Filter by Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={() => setOpenCreateModal(true)}
          variant="default"
          size="default"
        >
          {hasPermission("create:chapter")
            ? "Create Chapter"
            : hasPermission("propose:chapter")
              ? "Propose Chapter"
              : null}
        </Button>

        {openCreateModal && (
          <CreateChapterModal
            open={openCreateModal}
            onOpenChange={setOpenCreateModal}
          />
        )}
      </div>

      <Tabs defaultValue="published" className="grid-cols-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="published">Published Chapters</TabsTrigger>
          <TabsTrigger value="proposed">Proposed Chapters</TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPublishedChapters?.map((chapter) => (
              <Link
                href={`chapters/${chapter._id}`}
                key={chapter._id}
                className="block transition-transform duration-200 hover:scale-105"
              >
                <Card className="h-full">
                  <div className="relative h-40 w-full">
                    <Image
                      src={
                        chapter?.coverImage?.url || "/api/placeholder/400/320"
                      }
                      width={400}
                      height={320}
                      alt={chapter.name}
                      className="size-full rounded-t-lg object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="border-2 border-white">
                          <AvatarImage
                            src={chapter?.profileImage?.url}
                            alt={chapter.name}
                          />
                          <AvatarFallback>
                            {chapter?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="truncate font-semibold text-white">
                          {chapter.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <CardContent className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>{chapter.members?.length || 0} members</span>
                    </div>

                    <p className="line-clamp-2 text-sm text-gray-600">
                      {chapter.about}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="proposed">
          <Card>
            <CardContent className="h-72 space-y-2 overflow-y-scroll">
              {filteredProposedChapters.map((chapter) => (
                <div
                  key={chapter?._id}
                  className="mt-4 flex justify-between space-y-1 rounded-lg p-3 shadow-md"
                >
                  <div className="flex gap-4">
                    <div>
                      <Avatar>
                        <AvatarImage
                          src={chapter?.profileImage?.url}
                          alt="profile"
                        />
                        <AvatarFallback>
                          {chapter?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex items-center">{chapter?.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Eye className="cursor-pointer text-gray-600" /> */}
                    {hasPermission("publish:chapter") && (
                      <>
                        <Check
                          className="cursor-pointer text-green-500"
                          strokeWidth={3}
                          onClick={() =>
                            handleChapterApproval(chapter._id, "publish")
                          }
                        />
                        <X
                          className="cursor-pointer text-red-500"
                          strokeWidth={3}
                          onClick={() =>
                            // handleChapterApproval(chapter._id, "reject")
                            setIsReasonModelOpen(true)
                          }
                        />

                        <Dialog
                          open={isReasonModelOpen}
                          onOpenChange={setIsReasonModelOpen}
                        >
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Reject Reason</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this
                                chapter.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-1 items-center gap-4">
                                <Label htmlFor="reason" className="text-left">
                                  Reason
                                </Label>
                                <Textarea
                                  placeholder="Type your reason here."
                                  className="col-span-3"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                className="text-red-500"
                                onClick={() => setIsReasonModelOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                className="text-white"
                                onClick={() =>
                                  handleChapterApproval(chapter._id, "reject")
                                }
                              >
                                Submit
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* <Dialog open={isReasonModelOpen} onOpenChange={setIsReasonModelOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Reason</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this chapter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="reason" className="text-left">
                Reason
              </Label>
              <Textarea
                placeholder="Type your reason here."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="text-red-500"
              onClick={() => setIsReasonModelOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" className="text-white">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredChapters.map((chapter) => (
          <Card key={chapter._id} className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                height={500}
                width={500}
                src={chapter?.profileImage?.url}
                alt={`${chapter.name} placeholder`}
                className="h-32 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="truncate font-semibold">{chapter.name}</h3>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(chapter.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <p className="text-xs text-muted-foreground">
                Status: {chapter.status}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No chapters found matching your search.
        </div>
      )} */}
    </div>
  );
}
