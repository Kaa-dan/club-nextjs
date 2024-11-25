import { Card } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

interface INode {
  profileImage: string;
  coverImage: string;
  name: string;
  about: string;
  description: string;
  location: string;
  members: [];
}

const NodeCardMini: React.FC<{ node: INode }> = ({
  node: {
    profileImage,
    coverImage,
    name,
    about,
    description,
    location,
    members,
  },
}) => {
  return (
    <Card className="flex size-36 flex-col gap-1 rounded-sm p-3 text-xs">
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
        {`${location}`}
      </div>
    </Card>
  );
};

export default NodeCardMini;
