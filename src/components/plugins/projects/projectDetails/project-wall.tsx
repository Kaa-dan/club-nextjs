import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AnnouncementDialog from "../dialogs/announcement-dailog";
import { ProjectApi } from "../projectApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface ActivityItem {
  id: string;
  name: string;
  location: string;
  contribution: string;
  timestamp: string;
  avatarUrl?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
}

interface ProjectWallProps {
  onNewAnnouncement?: () => void;
  project: TProjectData;
}

const description = `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`;

const ProjectWall: React.FC<ProjectWallProps> = ({
  onNewAnnouncement,
  project,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activities, setActivities] = useState([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  function getALLAnnouncement() {
    ProjectApi.getAllAnnouncements(project?._id).then((res) => {
      console.log({ res });
      setAnnouncements(res.data);
    });
  }
  useEffect(() => {
    if (project) {
      ProjectApi.getAllProjectActivities(project?._id).then((res) => {
        setActivities(res);
      });

      // Fetch announcements
      getALLAnnouncement();
    }
  }, [project]);

  return (
    <div className="space-y-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Project Wall</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>

          <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
              <Button
                onClick={onNewAnnouncement}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                <Plus className="mr-2 size-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <AnnouncementDialog
              fetchAnnouncement={getALLAnnouncement}
              projectId={project?._id}
              setOpen={() => setOpen(false)}
            />
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity: any) => (
              <div
                key={activity._id}
                className="flex items-center space-x-4 rounded-lg bg-muted/80 p-4 shadow-sm"
              >
                <Avatar className="size-10 shadow-2xl">
                  <AvatarImage
                    src={activity?.author?.image}
                    alt={activity?.author?.userName}
                  />
                  <AvatarFallback>
                    {activity?.author?.userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <p className="font-medium">{activity?.author?.userName}</p>
                    <span className="mx-2 text-sm text-muted-foreground"></span>
                    <p className="text-sm text-muted-foreground">
                      {/* {activity.location} {` `} */}
                      Contributed {activity.contribution?.value + activity.contribution?.parameter?.unit.toUpperCase()}  to{" "}
                      {activity.contribution?.parameter?.title}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(
                      new Date(activity?.contribution?.createdAt),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No activities
            </p>
          )}
        </CardContent>
      </Card>

      {/* Announcements Section */}
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement: any) => (
              <div
                key={announcement.id}
                className="rounded-lg border p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={announcement?.user?.profileImage}
                        alt={announcement?.user?.userName}
                      />
                      <AvatarFallback>
                        {announcement?.user?.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {announcement?.user?.firstName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {announcement?.user?.userName}
                      </p>
                    </div>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(announcement.createdAt), {
                      addSuffix: true,
                    })}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">
                  {announcement.announcement}
                </p>
                {announcement.files && announcement.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {announcement.files.map((file: any, index: number) => (
                      <TooltipProvider key={file._id || index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative cursor-pointer">
                              {file.mimetype?.startsWith("image/") && (
                                <Image
                                  src={file.url}
                                  width={1000}
                                  height={1000}
                                  alt={file.originalname}
                                  className="h-24 w-24 object-cover rounded-md border hover:opacity-90 transition-opacity"
                                  onClick={() =>
                                    window.open(file.url, "_blank")
                                  }
                                />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1 p-2">
                              <p className="text-sm font-medium">
                                {file.originalname}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Size: {(file.size / 1024).toFixed(2)} KB
                              </p>
                              <p className="text-xs text-blue-500">
                                Click to preview
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No announcements
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectWall;
