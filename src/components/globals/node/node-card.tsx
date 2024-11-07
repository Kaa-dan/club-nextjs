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
    <Card className="flex flex-col text-xs rounded-sm gap-1 size-[9rem] p-3">
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
        {`${location}`}
      </div>
    </Card>
  );
};

export default NodeCardMini;
