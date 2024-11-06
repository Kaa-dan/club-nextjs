import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TNodeData } from "@/types";
import { Loader2, MapPin, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

const NodeJoinCard: React.FC<{
  node: TNodeData;
  requested: boolean;
  isLoading: boolean;
  onJoin: (id: string) => void;
}> = ({
  node: { name, profileImage, members, coverImage, location, ...node },
  requested,
  onJoin,
  isLoading,
}) => {
  return (
    <Card className="flex w-36 flex-col gap-1 rounded-sm p-3 text-xs">
      <Image
        height={200}
        width={200}
        src={profileImage}
        alt={name}
        className="size-10 rounded-md object-cover"
      />
      <span className="w-full truncate text-sm font-semibold">{name}</span>
      <div className="flex items-center gap-1">
        <Users size={"1rem"} />
        {members.length}
      </div>
      <div className="flex w-4/5 items-center rounded-md bg-slate-50 p-1">
        <MapPin size={"1rem"} className="text-red-500" />
        <span className="truncate">{`${location}`}</span>
      </div>
      <Dialog>
        <DialogTrigger className="w-full">
          <Button className="h-6 w-full p-0">Join</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Join {name}</DialogTitle>
          {/*cover photo and profile photo : profile photo half should cover bottom of cover photo*/}
          <div className="relative mb-8">
            <Image
              height={100}
              width={200}
              src={coverImage}
              alt={name}
              className="mx-auto h-32 w-96"
            />
            <Image
              height={200}
              width={200}
              src={profileImage}
              alt={name}
              className="absolute -bottom-10 left-1/2 size-20 -translate-x-1/2 rounded-full border-4 border-white object-cover"
            />
          </div>

          <span className="text-center text-base text-slate-500">
            Request to join this node?
          </span>
          <Button
            disabled={isLoading}
            className="mx-auto w-1/3"
            onClick={() => onJoin(node._id)}
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-white" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NodeJoinCard;
