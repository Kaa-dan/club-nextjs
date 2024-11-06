"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, Copy, LogOut, Search, Filter } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { fetchSpecificClub } from "@/components/pages/club/endpoint";
import { Endpoints } from "@/utils/endpoint";

export default function Page() {
  const [members, setMembers] = useState([]);
  const params = useParams<{ clubId: string }>();
  const visibleUsers = 5;
  const totalUsers = members.length;
  const remainingUsers = totalUsers - visibleUsers;

  useEffect(() => {
    Endpoints.fetchClubMembers(params.clubId as string)
      .then((res) => {
        setMembers(res);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Members
                <span className="text-sm font-normal text-muted-foreground">
                  • {members.length} Members
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {members.slice(0, visibleUsers).map((i) => (
                    <Avatar key={i} className="border-2 border-background">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32`}
                      />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                  {remainingUsers > 0 && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs">
                      {remainingUsers}+ {/* Display remaining users count */}
                    </div>
                  )}
                </div>
                <Button
                  variant="link"
                  className="text-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  See all
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button className="gap-2">
                <span>+ Invite</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </Button>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600 gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Leave</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">
              Our mission is simple but crucial: to protect and promote the
              well-being of trees and forests. Together, we can make a positive
              impact on our environment and leave a legacy
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <h4 className="font-semibold">Modules</h4>
              <p className="text-sm">
                <span className="text-green-500">12 Modules</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Contributions</h4>
              <p className="text-sm text-muted-foreground">15.2k</p>
            </div>
            <div>
              <h4 className="font-semibold">Clubs</h4>
              <p className="text-sm">
                <span className="text-green-500">12 Clubs</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Founded</h4>
              <p className="text-sm text-muted-foreground">1996</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
              Our mission is simple but crucial: to protect and promote the
              well-being of trees and forests. Together, we can make a positive
              impact on our environment and leave a legacy for generations to
              come. Our mission is simple but crucial: to protect and promote
              the well-being of trees and forests. Together, we can make a
              positive impact on our environment and leave a legacy for
              generations to come.
            </p>
            <Button variant="link" className="text-sm p-0">
              see all
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* dialogue  */}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>All Members</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between gap-4 my-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for Members..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member&#39;s Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.role}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        member.level === "Admin"
                          ? "bg-green-100 text-green-800"
                          : member.level === "Moderator"
                            ? "bg-orange-100 text-orange-800"
                            : undefined
                      }
                    >
                      {member.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.contribution}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Total 85 Members
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
              <select className="px-2 py-1 border rounded-md">
                <option>10 / page</option>
                <option>20 / page</option>
                <option>50 / page</option>
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
