"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useInView } from "react-intersection-observer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bookmark,
  Eye,
  File,
  MoreVertical,
  Save,
  Smile,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Endpoints } from "@/utils/endpoint";
import { useParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useTokenStore } from "@/store/store";
import { BookmarkModal } from "@/components/globals/bookmark/bookmark-modal";

interface FileType {
  url: string;
}

interface Author {
  name: string;
  title?: string;
}

type PostType = "projects" | "debate" | "issues";

interface BasePost {
  _id: string;
  author: Author;
  createdAt: string;
  files?: FileType[];
  relevant?: Array<{ user: string; date: Date }>;
  irrelevant?: Array<{ user: string; date: Date }>;
  title: string;
}

interface ProjectPost extends BasePost {
  type: "projects";
  projectSignificance: string;
  isBookmarked: boolean;
}

interface DebatePost extends BasePost {
  type: "debate";
  debateSignificance: string;
  isBookmarked: boolean;
}

interface IssuePost extends BasePost {
  type: "issues";
  issueSignificance: string;
  isBookmarked: boolean;
}

type Post = ProjectPost | DebatePost | IssuePost;

const NodePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState("");
  const [postType, setPostType] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { ref, inView } = useInView();
  const { clubId } = useParams<{ clubId: string }>();

  const fetchPosts = async (): Promise<void> => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await Endpoints.getFeeds("club", clubId, page);
      const newPosts = response.items;
      console.log({ response });

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  const handleRelevancyUpdate = (
    postId: string,
    action: "like" | "dislike",
    userId: string
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id !== postId) return post;

        const updatedPost = { ...post };

        // Initialize arrays if they don't exist
        if (!updatedPost.relevant) updatedPost.relevant = [];
        if (!updatedPost.irrelevant) updatedPost.irrelevant = [];

        if (action === "like") {
          const hasLiked = updatedPost.relevant.some(
            (item) => item.user === userId
          );
          if (hasLiked) {
            // Remove like
            updatedPost.relevant = updatedPost.relevant.filter(
              (item) => item.user !== userId
            );
          } else {
            // Add like and remove dislike if exists
            updatedPost.relevant.push({ user: userId, date: new Date() });
            updatedPost.irrelevant = updatedPost.irrelevant.filter(
              (item) => item.user !== userId
            );
          }
        } else {
          const hasDisliked = updatedPost.irrelevant.some(
            (item) => item.user === userId
          );
          if (hasDisliked) {
            // Remove dislike
            updatedPost.irrelevant = updatedPost.irrelevant.filter(
              (item) => item.user !== userId
            );
          } else {
            // Add dislike and remove like if exists
            updatedPost.irrelevant.push({ user: userId, date: new Date() });
            updatedPost.relevant = updatedPost.relevant.filter(
              (item) => item.user !== userId
            );
          }
        }

        return updatedPost;
      })
    );
  };

  return (
    <div className="mt-4 flex w-full flex-col items-start gap-3  px-4">
      {posts.map((post, index) => (
        <>
          <PostComponent
            setOpen={setOpen}
            setPostId={setPostId}
            setPostType={setPostType}
            clubId={clubId}
            key={`${post._id}-${index}`}
            post={post}
            onRelevancyUpdate={handleRelevancyUpdate}
          />
        </>
      ))}

      {loading && (
        <div className="flex justify-center p-4 item-center w-full">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      <div ref={ref} className="h-4" />

      {!hasMore && posts.length > 0 && (
        <div className=" p-4 text-center text-muted-foreground">
          No more posts to load
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center text-muted-foreground p-4">
          No posts available
        </div>
      )}
      {postId && (
        <BookmarkModal
          open={open}
          postType={postType}
          postId={postId}
          setOpen={setOpen}
        />
      )}
      {postType}
    </div>
  );
};

interface PostComponentProps {
  post: Post;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setPostId: Dispatch<SetStateAction<string>>;
  setPostType: Dispatch<SetStateAction<string>>;

  clubId: string;
  onRelevancyUpdate: (
    postId: string,
    action: "like" | "dislike",
    userId: string
  ) => void;
}

const PostComponent: React.FC<PostComponentProps> = ({
  post,
  clubId,
  onRelevancyUpdate,
  setOpen,
  setPostId,
  setPostType,
}) => {
  const { globalUser } = useTokenStore((state) => state);
  const userId = globalUser?._id;

  const handleRelevancy = async (
    type: "projects" | "issues" | "debate",
    assetId: string,
    action: "like" | "dislike"
  ) => {
    if (!userId) return;

    try {
      // Optimistically update UI
      onRelevancyUpdate(assetId, action, userId);

      // Make API call
      await Endpoints.relevancy(type, assetId, action);
    } catch (error) {
      // Revert optimistic update on error
      onRelevancyUpdate(
        assetId,
        action === "like" ? "dislike" : "like",
        userId
      );
      console.error("Error updating relevancy:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage alt={post.author.name} src="/placeholder.svg" />
              <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold leading-none">
                  {post?.author.name}
                </h2>
                <Badge variant="default" className="font-normal">
                  {post.type}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.author.title || "UI UX Designer"}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8">
              <Link href={`${clubId}/${post.type}/${post._id}/view`}>
                <Eye className="size-4" />
              </Link>
              <span className="sr-only">View count</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {post.type === "projects" && post.projectSignificance && (
          <p className="text-sm text-muted-foreground">
            {post.projectSignificance}
          </p>
        )}
        {post.type === "debate" && post.debateSignificance && (
          <p className="text-sm text-muted-foreground">
            {post.debateSignificance}
          </p>
        )}
        {post.type === "issues" && post.issueSignificance && (
          <p className="text-sm text-muted-foreground">
            {post.issueSignificance}
          </p>
        )}

        {post.files && post.files.length > 0 && (
          <div className="p-8">
            <Carousel className="w-full ">
              <CarouselContent>
                {post.files.map((file, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[4/3] w-full cursor-zoom-in">
                      <Image
                        src={file.url}
                        alt={`Post image ${index + 1}`}
                        className="rounded-md object-contain"
                        width={768}
                        height={576}
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}
        {post.type !== "debate" && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleRelevancy(post.type, post._id, "like")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ThumbsUp
                className={`size-5 transition-colors ${
                  post.relevant?.some((item) => item.user === userId)
                    ? "fill-current text-green-500"
                    : "text-gray-500"
                }`}
              />
              <span className="hidden lg:inline">
                {post.relevant?.length || "0"} Relevant
              </span>
            </Button>
            <Button
              onClick={() => handleRelevancy(post.type, post._id, "dislike")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ThumbsDown
                className={`size-5 transition-colors ${
                  post.irrelevant?.some((item) => item.user === userId)
                    ? "fill-current text-red-500"
                    : "text-gray-500"
                }`}
              />
              <span className="hidden text-red-500 lg:inline">
                {post.irrelevant?.length || "0"} Not Relevant
              </span>
            </Button>
            <Button
              onClick={() => {
                setOpen(true);
                setPostId(post._id);
                setPostType(post.type);
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Bookmark
                className={`size-4 ${post.isBookmarked ? "fill-current" : ""}`}
              />
              <span className="hidden lg:inline">
                {post.isBookmarked ? "saved" : "save"}
              </span>
            </Button>
          </div>
        )}
      </CardContent>
      {post.type !== "debate" && (
        <CardFooter>
          <div className="flex w-full items-center gap-2">
            <Input
              className="flex-1"
              placeholder="Write your comment..."
              type="text"
            />
            <Button variant="ghost" size="icon">
              <File className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Smile className="size-4" />
              <span className="sr-only">Add emoji</span>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default NodePage;

const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};
