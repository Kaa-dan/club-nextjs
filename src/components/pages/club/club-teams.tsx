// import React from "react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Ellipsis } from "lucide-react";

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
// const NodeTeams: React.FC = () => {

//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 w-[25%] h-fit text-xs max-w-sm mx-auto sticky top-16">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-base font-semibold text-gray-800">Gretchen Team</h2>
//         <Button variant="outline" className="text-xs text-black" size={"sm"}>
//           + Create team
//         </Button>
//       </div>

//       {/* Team List */}
//       <div className="">
//         {teams.map((team, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between p-1 py-2 rounded-lg border-t hover:bg-gray-100"
//           >
//             {/* Team Icon */}
//             <div className="flex items-center gap-2">
//               <Image
//                 src={team.icon}
//                 alt={`${team.name} icon`}
//                 width={40}
//                 height={40}
//                 className="rounded-md"
//               />

//               {/* Team Info */}
//               <div className=" flex-grow w-2/3">
//                 <p className="font-semibold text-gray-800">{team.name}</p>
//                 <p
//                   className={`text-xs ${team.badge ? "text-gray-700 font-medium" : "text-gray-500"}  truncate`}
//                 >
//                   {team.message}
//                 </p>
//               </div>
//             </div>

//             {/* Badge */}
//             <div className="flex items-center">
//               {team.badge && (
//                 <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
//                   {team.badge}
//                 </Badge>
//               )}

//               {/* Options Dropdown Menu */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger className="p-2 outline-none rounded-full">
//                   <Ellipsis
//                     size={"1.2rem"}
//                     className="text-slate-500 rotate-90"
//                   />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-32">
//                   <DropdownMenuItem asChild>
//                     <Link
//                       className="block px-4 py-2 text-gray-700"
//                       href="/view-team"
//                     >
//                       View
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link
//                       className="block px-4 py-2 text-gray-700"
//                       href="/edit-team"
//                     >
//                       Edit
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link
//                       className="block px-4 py-2 text-red-600"
//                       href="/delete-team"
//                     >
//                       Delete
//                     </Link>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NodeTeams;

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, ChevronLeft } from "lucide-react";

const TeamsSidePopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="group fixed mr-10 flex items-center justify-between rounded-l-full bg-green-100 p-3 py-5 pr-10 text-gray-700"
        >
          <div className="flex items-center gap-2">
            <ChevronLeft className="size-4 transition-transform group-data-[state=open]:rotate-90" />
            <span className=" text-xl font-semibold">Teams</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        side="left" // Changed to left
        sideOffset={5}
      >
        <div className="w-full rounded-lg bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-base font-semibold text-gray-800">
              Gretchen Team
            </h2>
            <Button variant="outline" className="text-xs text-black" size="sm">
              + Create team
            </Button>
          </div>

          {/* Team List */}
          <div className="max-h-[400px] overflow-y-auto">
            {teams.map((team, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b p-2 last:border-b-0 hover:bg-gray-50"
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
                  <div className="w-2/3 grow">
                    <p className="font-semibold text-gray-800">{team.name}</p>
                    <p
                      className={`text-xs ${
                        team.badge
                          ? "font-medium text-gray-700"
                          : "text-gray-500"
                      } truncate`}
                    >
                      {team.message}
                    </p>
                  </div>
                </div>

                {/* Badge */}
                <div className="flex items-center">
                  {team.badge && (
                    <Badge className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                      {team.badge}
                    </Badge>
                  )}

                  {/* Options Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-full p-2 outline-none">
                      <Ellipsis
                        size={16}
                        className="rotate-90 text-slate-500"
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
      </PopoverContent>
    </Popover>
  );
};

export default TeamsSidePopover;
