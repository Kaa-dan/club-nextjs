"use client";

// components/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";
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
import { Cross, Search, X } from "lucide-react";
import { toast } from "sonner";
import { SharedEndpoints } from "@/utils/endpoints/shared";
import club from "/public/icons/club-grey.icon.svg";
import node from "/public/icons/node-grey.icon.svg";

interface searchBtn {
  id: number;
  icon: string;
  Btn: string;
  alt: string;
}

const searchBtns: searchBtn[] = [
  { id: 1, icon: node, Btn: "Node", alt: "Node Icon" },
  { id: 2, icon: club, Btn: "Club", alt: "club Icon" },
  // { id: 3, Btn: "Tags", alt: "hash Icon" },
  // { id: 4, Btn: "Post", alt: "plus Icon" },
  // { id: 5, Btn: "People", alt: "people Icon" },
];

export const Navbar: React.FC = () => {
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [clubs, setClubs] = useState<
    { _id: string; name: string; profileImage: { url: string } }[]
  >([]);
  const [nodes, setNodes] = useState<
    { _id: string; name: string; profileImage: { url: string } }[]
  >([]);
  const [selectedButton, setSelectedButton] = useState<searchBtn | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        inputRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsSearchModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (term: string, tag?: string) => {
    try {
      const response = await SharedEndpoints.search(term, tag);
      console.log(response?.data, "response");
      setClubs(response?.data?.clubs || []);
      setNodes(response?.data?.nodes || []);
    } catch (error) {
      console.log(error, "error");
      toast.error("Something went wrong");
    }
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const term = event.target.value;
    console.log(term, "term");
    console.log(tag, "tag");
    setSearchTerm(term);
    if (term !== "") {
      tag ? handleSearch(term, tag) : handleSearch(term);
    } else {
      setClubs([]);
      setNodes([]);
    }
  };

  useEffect(() => {
    if (searchTerm !== "") {
      tag ? handleSearch(searchTerm, tag) : handleSearch(searchTerm);
    } else {
      setClubs([]);
      setNodes([]);
    }
  }, [tag]);

  const handleButtonClick = (button: searchBtn) => {
    setTag(button.Btn);
    setSelectedButton(button);
  };

  return (
    <header className="sticky top-0 z-20 mb-4 flex w-full flex-col items-center justify-around gap-4 px-6 py-3 text-xs">
      <div className="relative w-full">
        <div className="flex w-full gap-4">
          {/* Search Bar */}
          <div
            ref={inputRef}
            className="z-30 flex w-3/4 items-center rounded-md bg-white px-2 shadow-md"
          >
            <Search className="text-slate-500" size={"1.2rem"} />
            {selectedButton && (
              <div className="ml-2 flex w-max cursor-pointer items-center gap-2 rounded-md border-2 border-gray-400 bg-white px-2 text-base">
                <Image src={selectedButton?.icon} alt={selectedButton.alt} />
                {selectedButton.Btn}
                <X
                  className="size-8 self-center"
                  onClick={() => {
                    setSelectedButton(null);
                    setTag(null);
                  }}
                />
              </div>
            )}
            <Input
              placeholder="Search for node, club, people, tags etc..."
              className="w-full border-none"
              onFocus={() => setIsSearchModal(true)}
              // onBlur={() => setIsSearchModal(false)}
              onChange={handleSearchTermChange}
              value={searchTerm}
            />
          </div>

          {/* Icons and Profile */}
          {/* Message Icon */}
          <div className="z-20 flex items-center gap-4">
            <Link
              className=" flex items-center gap-2 rounded-md p-2 shadow-md hover:bg-gray-100"
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
            <button className="relative z-20 rounded-md p-2 shadow-md hover:bg-gray-100">
              <Image
                src={ICONS?.HeaderNotificationIcon}
                alt="Notification Icon"
                width={16}
                height={16}
              />
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-md bg-orange-500 text-xs text-white">
                2
              </span>
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-2 shadow-md">
                <Image
                  src={ICONS.HeaderProfileIcon}
                  alt="Dropdown Icon"
                  width={16}
                  height={16}
                  className="ml-2"
                />
                <span className="font-medium text-gray-700">Esther Howard</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                <DropdownMenuItem>
                  <Link
                    className="block px-4 py-2 text-gray-700"
                    href="/profile"
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    className="block px-4 py-2 text-gray-700"
                    href="/settings"
                  >
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    className="block px-4 py-2 text-gray-700"
                    href="/logout"
                  >
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isSearchModal && (
          <div
            ref={modalRef}
            className="absolute left-4 top-14 flex max-h-[65vh] min-w-[36vw] flex-col gap-4 overflow-y-scroll rounded-lg bg-white p-4 shadow-full-screen-overlay"
          >
            <div className="flex flex-col gap-2">
              <div className="text-base text-gray-600">Looking For....</div>
              <div className="flex gap-3">
                {searchBtns.map((button, index) => (
                  <div
                    key={index}
                    className="flex w-max cursor-pointer gap-2 rounded-md border-2 border-gray-400 bg-gray-200 px-2 text-base hover:border-gray-300 hover:bg-gray-300"
                    onClick={() => handleButtonClick(button)}
                  >
                    <Image src={button.icon} alt={button.alt} />
                    {button.Btn}
                  </div>
                ))}
                {/* <div className="w-max cursor-pointer rounded-md border-2 border-gray-400 bg-gray-200 px-2 text-base hover:border-gray-300 hover:bg-gray-300">
                  Club
                </div> */}
              </div>
            </div>
            {!(nodes?.length <= 0 && clubs?.length <= 0) ? (
              <>
                {nodes?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-base text-gray-800">Nodes</div>
                      <hr className="border-gray-600" />
                    </div>
                    {nodes?.length > 0 &&
                      nodes?.map((node, index) => (
                        <Link
                          href={`/node/${node?._id}`}
                          key={index}
                          className="flex cursor-pointer items-center gap-6"
                          onClick={() => setIsSearchModal(false)}
                        >
                          {node?.profileImage?.url && (
                            <Image
                              src={node?.profileImage?.url}
                              className="size-8 rounded-sm"
                              width={32}
                              height={32}
                              alt="search-icon"
                            />
                          )}
                          <div className="text-sm font-semibold text-gray-800">
                            {node?.name}
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
                {clubs.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-base text-gray-800">Clubs</div>
                      <hr className="border-gray-600" />
                    </div>
                    {clubs?.length > 0 &&
                      clubs?.map((club, index) => (
                        <Link
                          href={`/club/${club._id}`}
                          key={index}
                          className="flex cursor-pointer items-center gap-6 "
                          onClick={() => setIsSearchModal(false)}
                        >
                          {club?.profileImage?.url && (
                            <Image
                              src={club?.profileImage?.url}
                              className="size-8 rounded-sm"
                              width={32}
                              height={32}
                              alt="search-icon"
                            />
                          )}
                          <div className="text-sm font-semibold text-gray-800">
                            {club?.name}
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-base text-gray-600"> No result found...</div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
