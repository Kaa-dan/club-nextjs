"use client";
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
import { acceptOrRejectInvitation, getAllInvitations } from "../club/endpoint";

interface CoverImage {
  url: string;
  _id?: string;
}

interface Entity {
  _id: string;
  name: string;
  about: string;
  coverImage: CoverImage;
}

interface Invitation {
  _id: string;
  id: string;
  club?: Entity;
  status?: boolean;
  node?: Entity;
}

interface NotificationProps {
  ICON: string;
}

interface InvitationResponse {
  status: boolean;
}

const Notification: React.FC<NotificationProps> = ({ ICON }) => {
  // state to store all the invitations
  const [invite, setInvites] = useState<Invitation[]>([]);

  // gets all the invitations for the user
  const getInvitesHandler = async (): Promise<void> => {
    try {
      const response: Invitation[] = await getAllInvitations();
      console.log({ response });
      setInvites(response);
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    }
  };

  // accept or reject invitations
  const acceptInvitationHandler = async (
    invitationId: string,
    accept: boolean
  ): Promise<void> => {
    try {
      console.log({ invitationId, accept });
      const response = await acceptOrRejectInvitation(invitationId, accept);
      if (response) {
        // calling handler to get all the invitations
        getInvitesHandler();
      }
      if (response.status) {
        toast(response?.data?.message || "Something went wrong");
      }
      console.log({ inviteResult: response });
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    }
  };

  // getting all the invitations
  useEffect(() => {
    getInvitesHandler();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2 hover:bg-gray-100">
          <Image src={ICON} alt="Notification Icon" width={16} height={16} />
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
            {invite.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[350px]">
        <h3 className="mb-2 text-lg font-semibold">Invitations</h3>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {invite.map((invitation) =>
              invitation.club ? (
                <div
                  key={invitation?._id}
                  className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100"
                >
                  <div>
                    <Image
                      src={invitation?.club?.coverImage?.url}
                      alt={`${invitation?.club?.name} avatar`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="text-xs text-gray-500 text-center font-semibold">
                      club
                    </div>
                  </div>
                  <div className="grow">
                    <p className="font-medium">{invitation?.club?.name}</p>
                    <p className="text-sm text-gray-500">
                      {invitation?.club?.about}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      onClick={() =>
                        acceptInvitationHandler(invitation?._id, false)
                      }
                      size="sm"
                      variant="outline"
                    >
                      Ignore
                    </Button>
                    <Button
                      onClick={() =>
                        acceptInvitationHandler(invitation?._id, true)
                      }
                      size="sm"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={invitation?._id}
                  className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100"
                >
                  <div>
                    <Image
                      src={invitation?.node?.coverImage?.url}
                      alt={`${invitation?.node?.name} avatar`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="text-xs text-gray-500 text-center font-semibold">
                      node
                    </div>
                  </div>
                  <div className="grow">
                    <p className="font-medium">{invitation?.node?.name}</p>
                    <p className="text-sm text-gray-500">
                      {invitation?.node?.about}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      onClick={() =>
                        acceptInvitationHandler(invitation?._id, false)
                      }
                      size="sm"
                      variant="outline"
                    >
                      Ignore
                    </Button>
                    <Button
                      onClick={() =>
                        acceptInvitationHandler(invitation?._id, true)
                      }
                      size="sm"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
