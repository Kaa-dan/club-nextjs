import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Mail } from "lucide-react";

export default function CopyLink() {
  return (
    <DialogContent className="flex h-[70vh] max-w-md flex-col p-0">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle>Invite Member</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Search members..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Mail className="size-4" />
            </Button>
          </div>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scrollable Members List */}
      <div className="space-y-2 overflow-y-auto p-4 text-xs scrollbar-none ">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-muted"
          >
            <Image
              src={member.avatar}
              alt={`${member.name}'s avatar`}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-medium">{member.name}</div>
              <div className="text-muted-foreground">{member.role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="scrol sticky flex items-center justify-end border-t bg-white p-4">
        <Button>Copy Link</Button>
      </div>
    </DialogContent>
  );
}

const members = [
  {
    id: 1,
    name: "Cameron Williamson",
    role: "UI UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Courtney Henry",
    role: "Marketing Coordinator",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Cody Fisher",
    role: "Recruiting Assistant",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Cofgery Fox",
    role: "President of Sales",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Cermot Williamson",
    role: "Web Designer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];
