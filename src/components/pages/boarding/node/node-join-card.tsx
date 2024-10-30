import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NodeData } from "@/types";
import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

const NodeJoinCard: React.FC<{
  node: NodeData;
  requested: boolean;
  onJoin: () => void;
}> = ({
  node: { name, profileImage, members, coverImage, location },
  requested,
  onJoin,
}) => {
  return (
    <Card className="flex flex-col text-xs rounded-sm gap-1 w-[9rem] p-3">
      <Image
        height={200}
        width={200}
        src={profileImage}
        alt={name}
        className="size-10 object-cover rounded-md"
      />
      <span className="text-sm font-semibold w-full truncate">{name}</span>
      <div className="flex items-center gap-1">
        <Users size={"1rem"} />
        {members.length}
      </div>
      <div className="w-4/5 p-1 bg-slate-50 rounded-md flex items-center">
        <MapPin size={"1rem"} className="text-red-500" />
        <span className="truncate">{`${location}`}</span>
      </div>
      <Dialog>
        <DialogTrigger className="w-full">
          <Button className="p-0 h-6 w-full">Join</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Join {name}</DialogTitle>
          {/*cover photo and profile photo : profile photo half should cover bottom of cover photo*/}
          <div className="relative mb-8">
            <Image
              height={200}
              width={400}
              src={coverImage}
              alt={name}
              className="h-32 w-96 mx-auto"
            />
            <Image
              height={200}
              width={200}
              src={profileImage}
              alt={name}
              className="size-20 object-cover absolute rounded-full border-4 border-white -bottom-10 left-1/2 -translate-x-1/2"
            />
          </div>

          <span className="text-center text-base text-slate-500">
            Are you sure you want to join this node?
          </span>
          <Button className="w-1/3 mx-auto" onClick={onJoin}>
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NodeJoinCard;
