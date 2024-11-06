"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ClubMembersList({
  isModalOpen,
  setIsModalOpen,
  members,
}) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <div className="p-6 border-b">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl">All Members</DialogTitle>
            <Button
              size="sm"
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              + Invite
            </Button>
          </DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for members..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-6">
                  Member's Name
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-6">
                  Level
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-6">
                  Contributions
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-6">
                  Join Date
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={member.user.profileImage}
                          alt={`${member.firstName} ${member.lastName}`}
                        />
                        <AvatarFallback>
                          {member.firstName}
                          {member.lastName}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          {member.user.firstName} {member.user.lastName}
                        </div>
                        {/* <div className="text-sm text-muted-foreground">
                          {member.}
                        </div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={
                        member.role === "admin"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : member.level === "moderator"
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {member.contributions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Member</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-6 border-t">
          <div className="text-sm text-muted-foreground">
            Total {members.length} Members
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <nav
                className="flex items-center space-x-1"
                aria-label="Pagination"
              >
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  1
                </Button>
                <span className="text-muted-foreground">...</span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  4
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-violet-600 text-white hover:bg-violet-700"
                >
                  5
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  6
                </Button>
                <span className="text-muted-foreground">...</span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  20
                </Button>
              </nav>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
            <Select defaultValue="10">
              <SelectTrigger className="w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
