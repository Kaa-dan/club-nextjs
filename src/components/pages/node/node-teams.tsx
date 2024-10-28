import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

const NodeTeams: React.FC = () => {
  const teams = [
    {
      name: "Team Forever",
      icon: "https://picsum.photos/200",
      message: "Cameron: 📷 Photos",
      badge: "15+",
    },
    {
      name: "Designers",
      icon: "https://picsum.photos/200",
      message: "Cameron: thanks @john",
      badge: "8+",
    },
    {
      name: "Divide and Conquer",
      icon: "https://picsum.photos/200",
      message: "Me: like your idea",
      badge: "",
    },
    {
      name: "Fast Talkers",
      icon: "https://picsum.photos/200",
      message: "Barely has change the group icon.",
      badge: "",
    },
    {
      name: "Paper Pushers",
      icon: "https://picsum.photos/200",
      message: "Cameron: Shall we now?",
      badge: "",
    },
    {
      name: "Legal Eliminators",
      icon: "https://picsum.photos/200",
      message: "Me: like your idea",
      badge: "",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-[25%] h-fit text-xs max-w-sm mx-auto sticky top-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">Gretchen Team</h2>
        <Button variant="outline" className="text-xs text-black" size={"sm"}>
          + Create team
        </Button>
      </div>

      {/* Team List */}
      <div className="">
        {teams.map((team, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-1 py-2 rounded-lg border-t hover:bg-gray-100"
          >
            {/* Team Icon */}
            <div className="flex items-center gap-2">
              <Image
                src={team.icon}
                alt={`${team.name} icon`}
                width={40}
                height={40}
                className="rounded-md"
              />

              {/* Team Info */}
              <div className=" flex-grow w-2/3">
                <p className="font-semibold text-gray-800">{team.name}</p>
                <p
                  className={`text-xs ${team.badge ? "text-gray-700 font-medium" : "text-gray-500"}  truncate`}
                >
                  {team.message}
                </p>
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-center">
              {team.badge && (
                <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {team.badge}
                </Badge>
              )}

              {/* Options Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 outline-none rounded-full">
                  <Ellipsis
                    size={"1.2rem"}
                    className="text-slate-500 rotate-90"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuItem asChild>
                    <Link
                      className="block px-4 py-2 text-gray-700"
                      href="/view-team"
                    >
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      className="block px-4 py-2 text-gray-700"
                      href="/edit-team"
                    >
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      className="block px-4 py-2 text-red-600"
                      href="/delete-team"
                    >
                      Delete
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeTeams;
