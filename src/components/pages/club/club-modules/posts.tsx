import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import React from "react";
//post card
function PostCard() {
  return (
    <Card className="max-w-2xl  ">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage alt="Cameron Williamson" src="/placeholder.svg" />
              <AvatarFallback>CW</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold leading-none">
                  Cameron Williamson
                </h2>
                <Badge variant="default" className="font-normal">
                  News & events
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>UI UX Designer</span>
                <span>•</span>
                <span>2 min ago</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8">
              <Eye className="size-4" />
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
        <div className="space-y-2">
          <p>
            Creating a code of conduct for a social media group is essential to
            maintain a positive and respectful online community. Here are some
            general rules and guidelines you might consider.
          </p>
          <p className="text-muted-foreground">
            Creating a code of conduct for a social media group is essential to
            maintain a positive and respectful online community. Here are some
            general rules and guidelines you might consider.
            <Button variant="link" className="h-auto p-0">
              see more
            </Button>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ThumbsUp className="size-4" />
            <span className="hidden lg:inline">5k+ Relevant</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ThumbsDown className="size-4 text-red-500" />
            <span className="hidden text-red-500 lg:inline">
              5k+ Not Relevant
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
}
const Posts = () => {
  return (
    <div className="flex flex-col  gap-3">
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
};

export default Posts;
