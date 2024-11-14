"use client";

import { ICONS } from "@/lib/constants";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { getAllInvitations } from "../club/endpoint";

// Mock data for club invitations
const clubInvitations = [
  { id: 1, name: "Chess Club", avatar: "/chess-club-avatar.jpg" },
  { id: 2, name: "Book Club", avatar: "/book-club-avatar.jpg" },
  { id: 3, name: "Hiking Club", avatar: "/hiking-club-avatar.jpg" },
  { id: 4, name: "Cooking Club", avatar: "/cooking-club-avatar.jpg" },
  { id: 5, name: "Photography Club", avatar: "/photography-club-avatar.jpg" },
];

const Notification = ({ ICON }: { ICON: string }) => {
  let [invite, setInvites] = useState([]);
  console.log("nithin");
  console.log({ invite });
  const getInvitesHandler = async () => {
    try {
      const response = await getAllInvitations();
      console.log({ response });
      setInvites(response);
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    getInvitesHandler();
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2 hover:bg-gray-100">
          <Image src={ICON} alt="Notification Icon" width={16} height={16} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
            {invite.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="mb-2 text-lg font-semibold">Club Invitations</h3>
        <ScrollArea className="h-64">
          {/* <div className="space-y-2">
            {invite.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100"
              >
                <Image
                  src={invitation.avatar}
                  alt={`${invitation.name} avatar`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-grow">
                  <p className="font-medium">{invitation.name}</p>
                  <p className="text-sm text-gray-500">Invited you to join</p>
                </div>
                <div className="space-x-2">
                  <Button size="sm" variant="outline">
                    Ignore
                  </Button>
                  <Button size="sm">Accept</Button>
                </div>
              </div>
            ))}
          </div> */}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
