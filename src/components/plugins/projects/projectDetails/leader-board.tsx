"use client";

import * as React from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Member {
  id: number;
  name: string;
  role: string;
  image: string;
  comfortableClothing: string;
  hydration: string;
  total: string;
}

const members: Member[] = [
  {
    id: 1,
    name: "Cameron Williamson",
    role: "UI/UX Designer",
    image: "/placeholder.svg?height=40&width=40",
    comfortableClothing: "2.5k",
    hydration: "2.5k",
    total: "2.5k",
  },
  {
    id: 2,
    name: "Bessie Cooper",
    role: "President of Sales",
    image: "/placeholder.svg?height=40&width=40",
    comfortableClothing: "256",
    hydration: "256",
    total: "256",
  },
  {
    id: 3,
    name: "Ronald Richards",
    role: "Dog Trainer",
    image: "/placeholder.svg?height=40&width=40",
    comfortableClothing: "19.5k",
    hydration: "19.5k",
    total: "19.5k",
  },
  {
    id: 4,
    name: "Courtney Henry",
    role: "Web Designer",
    image: "/placeholder.svg?height=40&width=40",
    comfortableClothing: "2.3k",
    hydration: "2.3k",
    total: "2.3k",
  },
  {
    id: 5,
    name: "Jacob Jones",
    role: "Nursing Assistant",
    image: "/placeholder.svg?height=40&width=40",
    comfortableClothing: "1.2k",
    hydration: "1.2k",
    total: "1.2k",
  },
  {
    id: 6,
    name: "Brooklyn Simmons",
    role: "Medical Assistant",
    image: "/placeholder.svg?height=40&width=40",
    comfortableClothing: "20",
    hydration: "20",
    total: "20",
  },
  {
    id: 7,
    name: "Robert Fox",
    role: "Web Designer",
    image: "/placeholder.svg?height=40&width=40",
    comfortableClothing: "9",
    hydration: "9",
    total: "9",
  },
];

export function LeaderBoard() {
  const [view, setView] = React.useState<"member" | "forum">("member");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = members.slice(startIndex, endIndex);
  const totalPages = Math.ceil(members.length / itemsPerPage);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Blood Donation</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Private</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Donate Blood, Save Lives: Your generous contribution can make a world
          of difference to those in need. Join us in our mission to provide
          lifesaving blood to patients in hospitals and medical facilities.
        </p>
      </div>
      <div className="mb-4 flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Member wise</span>
          <Switch
            checked={view === "forum"}
            onCheckedChange={(checked) => setView(checked ? "forum" : "member")}
          />
          <span className="text-sm font-medium">Forum wise</span>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No.</TableHead>
              <TableHead>Member&apos;s name</TableHead>
              <TableHead className="text-right">Comfortable Clothing</TableHead>
              <TableHead className="text-right">Hydration</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.role}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {member.comfortableClothing}
                </TableCell>
                <TableCell className="text-right">{member.hydration}</TableCell>
                <TableCell className="text-right">{member.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center px-2 justify-center gap-2 ">
        <div className="text-sm text-muted-foreground">
          Total {members.length} Members
        </div>
        <div className="flex  space-x-6 lg:space-x-8 ">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LeaderBoard;
