'use client'

import React, { useState, useEffect } from "react";
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
  CarouselNext 
} from "@/components/ui/carousel";

interface FileType {
  url: string;
}

interface Author {
  name: string;
  title?: string;
}
type PostType = 'projects' | 'debate' | 'issues';

interface BasePost {
  _id: string;
  author: Author;
  createdAt: string;
  files?: FileType[];
  relevantCount?: number;
  notRelevantCount?: number;
  title: string;
}

interface ProjectPost extends BasePost {
  type: 'projects';
  projectSignificance: string;
}

interface DebatePost extends BasePost {
  type: 'debate';
  debateSignificance: string;
}

interface IssuePost extends BasePost {
  type: 'issues';
  issueSignificance: string;
}

type Post = ProjectPost | DebatePost | IssuePost;

const NodePage: React.FC = () => {
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
      const response = await Endpoints.getFeeds('club', clubId, page);
      const newPosts = response.items;
      
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading]);

  return (
    <div className="mt-4 flex flex-col items-center gap-3 w-full px-4">
      {posts.map((post) => (
        <PostComponent clubId={clubId} key={post._id} post={post} />
      ))}
      
      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      
      <div ref={ref} className="h-4" />
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center text-muted-foreground p-4">
          No more posts to load
        </div>
      )}
    </div>
  );
};

interface PostComponentProps {
  post: Post;
  clubId:string
}

const PostComponent: React.FC<PostComponentProps> = ({ post,clubId }) => {
  const handleEdit = (): void => {
    // Handle edit
  };

  const handleDelete = (): void => {
    // Handle delete
  };

  const handleReport = (): void => {
    // Handle report
  };

  return (
    <Card className="w-full  max-w-md ">
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
                <span>{post.author.title || 'UI UX Designer'}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8">
              <Link href={`${clubId}/${post.type}/${post._id}/view`} >
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
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
      {post.type === 'projects' && post.projectSignificance && (
    <p className="text-sm text-muted-foreground">
     {post.projectSignificance || "hello"}
    </p>
  )}
  {post.type === 'debate' && post.debateSignificance && (
    <p className="text-sm text-muted-foreground">
    {post.debateSignificance}
    </p>
  )}
  {post.type === 'issues' && post.issueSignificance && (
    <p className="text-sm text-muted-foreground">
  {post.issueSignificance}
    </p>
  )}
        {post.files && post.files.length > 0 && (
          <Carousel className="w-full ">
            <CarouselContent>
              {post.files.map((file, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full aspect-[4/3] cursor-zoom-in">
                    <Image
                      src={file.url}
                      alt={`Post image ${index + 1}`}
                      className="object-contain rounded-md"
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
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ThumbsUp className="size-4" />
            <span className="hidden lg:inline">{post.relevantCount || '5k+'} Relevant</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ThumbsDown className="size-4 text-red-500" />
            <span className="hidden text-red-500 lg:inline">
              {post.notRelevantCount || '5k+'} Not Relevant
            </span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Bookmark className="size-4" />
            <span className="hidden lg:inline">Save</span>
          </Button>
        </div>
      </CardContent>
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
    </Card>
  );
};

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

export default NodePage;