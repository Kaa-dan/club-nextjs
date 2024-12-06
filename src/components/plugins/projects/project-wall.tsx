import React from "react";
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
import { Label } from "@/components/ui/lable";
import { Input } from "@/components/ui/input";
import AnnouncementDialog from "./dialogs/announcement-dailog";
interface ActivityItem {
  id: string;
  name: string;
  location: string;
  contribution: string;
  timestamp: string;
  avatarUrl?: string;
}

interface ProjectWallProps {
  onNewAnnouncement?: () => void;
}

const activities = [
  {
    id: "1",
    name: "Prince",
    location: "Vichithram",
    contribution: "362 Books",
    timestamp: "21 Mar 2024 • 6:30 PM",
    avatarUrl: "/path/to/avatar.jpg", // optional
  },
  {
    id: "2",
    name: "Brince",
    location: "Bichithram",
    contribution: "362 Books",
    timestamp: "21 Mar 2024 • 7:30 PM",
    avatarUrl: "/path/to/avatar.jpg", // optional
  },
  {
    id: "3",
    name: "Rishal",
    location: "Bangalore",
    contribution: "262 Books",
    timestamp: "21 Mar 2024 • 7:30 PM",
    avatarUrl: "/path/to/avatar.jpg", // optional
  },
];

const description = `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`;
const ProjectWall: React.FC<ProjectWallProps> = ({ onNewAnnouncement }) => {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold">Project Wall</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={onNewAnnouncement}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              <Plus className="mr-2 size-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <AnnouncementDialog />
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
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
                <span className="mx-2 text-sm text-muted-foreground">from</span>
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
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectWall;
