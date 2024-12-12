import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

  useEffect(() => {
    if (project) {
      ProjectApi.getAllProjectActivities(project?._id).then((res) => {
        setActivities(res);
      });

      // Fetch announcements
      // ProjectApi.getProjectAnnouncements(project?._id).then((res) => {
      //   setAnnouncements(res);
      // });
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
              projectId={project?._id}
              setOpen={() => setOpen(false)}
            />
          </Dialog>
        </CardHeader>

        {/* <CardContent className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center space-x-4 rounded-lg bg-muted/80 p-4 shadow-sm"
              >
                <Avatar className="size-10 shadow-2xl">
                  <AvatarImage src={activity.avatarUrl} alt={activity.name} />
                  <AvatarFallback>
                    {activity.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <p className="font-medium">{activity.name}</p>
                    <span className="mx-2 text-sm text-muted-foreground">
                      from
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {activity.location} {` `}
                      Contributed {activity.contribution}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No activities
            </p>
          )}
        </CardContent> */}
      </Card>

      {/* Announcements Section */}
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={announcement.author.avatarUrl}
                        alt={announcement.author.name}
                      />
                      <AvatarFallback>
                        {announcement.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {announcement.author.name}
                      </p>
                    </div>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {announcement.createdAt}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">
                  {announcement.content}
                </p>
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
