import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
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
  type: string;
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
      const response: User[] = await searchUser(search);
      setAllUsers(response);
    } catch (error) {
      console.log({ error });
      toast("can't fetch user right now");
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
        <Button className="gap-2 ">
          <span>+ Invite </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Invite Member
          </DialogTitle>
        </DialogHeader>
        <hr />

        <div className="grid gap-4 py-4">
          <div className="relative flex gap-5">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search members..."
              className="pl-8"
            />
            <div className="flex items-center space-x-2 rounded-md border px-2">
              <Mail />
              <Label htmlFor="email-invite">Email</Label>
            </div>
          </div>
          <hr />
          <div className="rounded-md">
            <Select>
              {/* country select  */}
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent className="bg-white ">
                <SelectItem className="w-full" value="new-york">
                  New York
                </SelectItem>
                <SelectItem value="los-angeles">Los Angeles</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="houston">Houston</SelectItem>
                <SelectItem value="miami">Miami</SelectItem>
                <SelectItem value="seattle">Seattle</SelectItem>
                <SelectItem value="boston">Boston</SelectItem>
                <SelectItem value="san-francisco">San Francisco</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="max-h-[200px] space-y-4 overflow-y-auto">
            {allUsers?.map((user: User) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="size-16">
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
                <button
                  onClick={() =>
                    sentInvitationHandler(entityId, user._id, type)
                  }
                  className="rounded-md bg-green-500 px-2 py-1 text-white"
                >
                  Invite
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Copy Link</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
