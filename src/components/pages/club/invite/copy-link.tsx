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
    <DialogContent className="max-w-md h-[70vh] p-0 flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle>Invite Member</DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search members..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Mail className="h-4 w-4" />
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
      <div className="space-y-2 text-xs p-4 overflow-y-auto scrollbar-none ">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
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
      <div className="sticky scrol bg-white border-t p-4 flex items-center justify-end">
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
