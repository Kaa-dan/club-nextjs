// components/Navbar.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ICONS } from "@/lib/constants";
import { Search } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 w-full z-20 px-6 mb-4 py-3 flex gap-4 items-center justify-around text-xs">
      {/* Search Bar */}
      <div className="w-[75%] flex items-center bg-white shadow-md rounded-md px-2">
        <Search className="text-slate-500" size={"1.2rem"} />
        <Input
          placeholder="Search for node, club, people, tags etc..."
          className="w-full border-none"
        />
      </div>

      {/* Icons and Profile */}
      {/* Message Icon */}
      <div className="flex items-center gap-4 z-20">
        <Link
          className=" p-2 flex gap-2 items-center rounded-md shadow-md hover:bg-gray-100"
          href="/messages"
        >
          <Image
            src={ICONS.HeaderMessageIcon}
            alt="Message Icon"
            width={16}
            height={16}
          />
          Message
        </Link>

        {/* Notification Icon with Badge */}
        <button className="relative z-20 p-2 rounded-md shadow-md hover:bg-gray-100">
          <Image
            src={ICONS.HeaderNotificationIcon}
            alt="Notification Icon"
            width={16}
            height={16}
          />
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-md w-4 h-4 flex items-center justify-center">
            2
          </span>
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center rounded-md flex gap-2 shadow-md p-2">
            <Image
              src={ICONS.HeaderProfileIcon}
              alt="Dropdown Icon"
              width={16}
              height={16}
              className="ml-2"
            />
            <span className="text-gray-700 font-medium">Esther Howard</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <DropdownMenuItem>
              <Link className="block px-4 py-2 text-gray-700" href="/profile">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="block px-4 py-2 text-gray-700" href="/settings">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="block px-4 py-2 text-gray-700" href="/logout">
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
