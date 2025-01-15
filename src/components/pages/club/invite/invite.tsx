"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, Search, Mail } from "lucide-react";
import { PointerEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { searchUser, sentInvitation } from "../endpoint";

// User interface
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

// Component props interface
interface InviteProps {
  entityId: string;
  type: "node" | "club";
}

// API response interfaces
interface InvitationResponse {
  success: boolean;
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      message: string;
    };
  };
  message?: string;
}

export default function Invite({ entityId, type }: InviteProps): JSX.Element {
  const [inviteOpen, setInviteOpen] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");

  // Get or search users
  const getUsersHandler = async (search: string): Promise<void> => {
    try {
      const response: User[] = await searchUser(search, type, entityId);
      console.log({ allUsersNotInTheEntity: response });
      setAllUsers(response);
    } catch (error) {
      console.log({ error });
      toast.error("Can't fetch users right now");
    }
  };

  // Send invitation handler
  const sentInvitationHandler = async (
    entityId: string,
    inviteId: string,
    type: string
  ): Promise<void> => {
    console.log({ entityId, inviteId, type });

    try {
      const response: InvitationResponse = await sentInvitation(
        entityId,
        inviteId,
        type
      );
      if (response.success === true) {
        toast.success(response.message);
      }
      getUsersHandler(search);
    } catch (error: unknown) {
      console.log({ error });
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message ||
          apiError?.message ||
          "Something Went Wrong!"
      );
    }
  };

  useEffect(() => {
    if (inviteOpen) {
      getUsersHandler(search);
    }
  }, [inviteOpen, search]);

  return (
    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <span>+ Invite </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px]"
        // onPointerDownOutside={(e: PointerEvent) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Invite Member
          </DialogTitle>
        </DialogHeader>
        <hr />

        <div className="grid gap-4 py-4">
          <div className="relative flex gap-5">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search members..."
              className="pl-8"
            />
          </div>
          <hr />

          <div className="max-h-[200px] space-y-4 overflow-y-auto">
            {allUsers.length > 0 ? (
              allUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="flex w-[95%] items-center justify-between"
                >
                  <div className="flex gap-4">
                    <div className="h-16 w-16">
                      <Avatar>
                        <AvatarImage
                          src={user?.profileImage}
                          alt={user?.firstName}
                        />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col justify-center text-lg text-slate-600">
                      <div className="flex gap-4">
                        <p className="font-medium uppercase leading-none">
                          {user?.firstName}
                        </p>
                        <p className="font-medium uppercase leading-none">
                          {user?.lastName}
                        </p>
                      </div>
                      <div className="text-base uppercase text-slate-400">
                        doctor
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      sentInvitationHandler(entityId, user?._id, type)
                    }
                    className="bg-green-400 text-white hover:bg-green-500"
                  >
                    Invite
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[200px] text-slate-500">
                No search results found
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => {
              setInviteOpen(false);
            }}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
