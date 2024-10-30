"use client";

import Link from "next/link";
import { Ellipsis, HomeIcon, Icon, LogOut, Plus, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { getMenuList } from "@/lib/constants/menu-list";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
interface MenuProps {
  isOpen: boolean | undefined;
}
interface Node {
  id: string;
  name: string;
  image: string;
}
const nodes: Node[] = [
  {
    id: "1",
    name: "Gillette",
    image: "https://picsum.photos/200/200?height=80&width=80",
  },
  {
    id: "2",
    name: "McDonald's",
    image: "https://picsum.photos/200/200?height=80&width=80",
  },
  {
    id: "3",
    name: "General Electric",
    image: "https://picsum.photos/200/200?height=80&width=80",
  },
  {
    id: "4",
    name: "Ulysses S. Grant",
    image: "https://picsum.photos/200/200?height=80&width=80",
  },
  {
    id: "5",
    name: "Benjamin Harrison",
    image: "https://picsum.photos/200/200?height=80&width=80",
  },
  {
    id: "6",
    name: "Abraham Lincoln",
    image: "https://picsum.photos/200/200?height=80&width=80",
  },
  {
    id: "7",
    name: "Chester A. Arthur",
    image: "https://picsum.photos/200/200?height=80&width=80",
  },
  {
    id: "8",
    name: "Herbert Hoover",
    image: "https://picsum.photos/200/200?height=80&width=80",
  },
  {
    id: "9",
    name: "George Washington",
    image: "https://picsum.photos/200?height=80&width=80",
  },
  {
    id: "10",
    name: "Franklin D. Roosevelt",
    image: "https://picsum.photos/200?height=80&width=80",
  },
  {
    id: "11",
    name: "Franklin D. Roosevelt",
    image: "https://picsum.photos/200?height=80&width=80",
  },
  {
    id: "12",
    name: "General Electric",
    image: "https://picsum.photos/200?height=80&width=80",
  },
  {
    id: "13",
    name: "Chester A. Arthur",
    image: "https://picsum.photos/200?height=80&width=80",
  },
  {
    id: "14",
    name: "Herbert Hoover",
    image: "https://picsum.photos/200?height=80&width=80",
  },
  {
    id: "15",
    name: "Benjamin Harrison",
    image: "https://picsum.photos/200?height=80&width=80",
  },
];

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const [menuList, setMenuList] = useState<any[]>();

  async function fetchMenuList() {
    const _menuList = await getMenuList(pathname);
    setMenuList(_menuList);
    console.log("menuList", menuList);
    return menuList;
  }
  const router = useRouter();

  useEffect(() => {
    fetchMenuList();
  }, []);
  if (!menuList) return;

  return (
    <ScrollArea className=" [&>div>div[style]]:!block">
      <nav className="mt-8 size-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1  px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList &&
            menuList?.length > 0 &&
            menuList?.map(({ groupLabel, menus }, index) => (
              <li
                className={cn("w-full ", groupLabel ? "pt-5" : "")}
                key={index}
              >
                {(isOpen && groupLabel) || isOpen === undefined ? (
                  <p className="max-w-[248px] truncate  px-4 pb-2 text-sm font-medium text-muted-foreground">
                    {/* {groupLabel} */}
                    {groupLabel === "Nodes" ? (
                      <Image
                        src={ICONS.NodeGreyIcon}
                        alt="node_logo"
                        height={50}
                        width={50}
                        className="ml-2 size-4 object-cover"
                      />
                    ) : groupLabel === "Clubs" ? (
                      <Image
                        src={ICONS.ClubGreyIcon}
                        alt="club_logo"
                        height={50}
                        width={50}
                        className="ml-2 size-4 object-cover"
                      />
                    ) : (
                      <Ellipsis size={30} />
                    )}
                  </p>
                ) : !isOpen && isOpen !== undefined && groupLabel ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="mb-2 w-full ">
                        <div className="flex w-full items-center justify-center ">
                          {groupLabel === "Nodes" ? (
                            <Image
                              src={ICONS.NodeGreyIcon}
                              alt="node_logo"
                              height={50}
                              width={50}
                              className="size-4 object-cover"
                            />
                          ) : groupLabel === "Clubs" ? (
                            <Image
                              src={ICONS.ClubGreyIcon}
                              alt="club_logo"
                              height={50}
                              width={50}
                              className="size-4 object-cover"
                            />
                          ) : (
                            <Ellipsis size={30} />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <p className="pb-2"></p>
                )}
                {menus?.map(
                  (
                    { href, label, key, image, active, submenus }: any,
                    index: any
                  ) =>
                    submenus.length === 0 ? (
                      <div className="relative w-full " key={index}>
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              {["createNode", "createClub"].includes(
                                key || ""
                              ) ? (
                                <Popover>
                                  <PopoverTrigger className="w-full">
                                    <Button
                                      variant={active ? "default" : "ghost"}
                                      className="relative mx-1 mb-1 w-full cursor-pointer justify-start   !py-6"
                                      asChild
                                      onClick={() => {
                                        const isCreateButton = [
                                          "createNode",
                                          "createClub",
                                        ].includes(key || "");
                                        if (!isCreateButton) {
                                          return router.push(href);
                                        }
                                      }}
                                    >
                                      <div className="">
                                        <span
                                          className={cn(
                                            isOpen === false ? "" : "mr-4"
                                          )}
                                        >
                                          {label === "Home" ? (
                                            <HomeIcon />
                                          ) : (
                                            <div
                                              className={cn(
                                                "rounded-xl  object-cover relative",
                                                index === 0 &&
                                                  groupLabel === "Nodes"
                                                  ? "p-[5px] bg-primary/80 -ml-[5px]"
                                                  : ""
                                              )}
                                            >
                                              <Image
                                                src={image}
                                                height={50}
                                                width={50}
                                                className={cn(
                                                  "size-9 rounded-lg  object-cover",
                                                  [
                                                    "createNode",
                                                    "createClub",
                                                  ].includes(key || "")
                                                    ? "brightness-50"
                                                    : ""
                                                )}
                                                alt={label}
                                              />
                                              {[
                                                "createNode",
                                                "createClub",
                                              ].includes(key || "") && (
                                                <Plus
                                                  size={"2rem"}
                                                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  font-extrabold text-white"
                                                />
                                              )}
                                            </div>
                                          )}
                                        </span>
                                        <span
                                          hidden={!isOpen}
                                          className={cn(
                                            "max-w-[200px] truncate",
                                            isOpen === false
                                              ? "-translate-x-96 opacity-0"
                                              : "translate-x-0 opacity-100 "
                                          )}
                                        >
                                          {label}
                                        </span>
                                      </div>
                                      {/* Active marker */}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[480px] p-0"
                                    align="start"
                                  >
                                    <div className="flex items-center justify-between border-b p-2">
                                      <div className="px-2 font-semibold">
                                        Nodes
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Link
                                          href="#"
                                          className="text-xs text-primary hover:underline"
                                        >
                                          See all
                                        </Link>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="size-6"
                                        >
                                          <X className="size-4" />
                                          <span className="sr-only">Close</span>
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-5 gap-3 p-4">
                                      {nodes.map((node) => (
                                        <button
                                          key={node.id}
                                          className="flex flex-col items-center gap-1 rounded-lg p-1 text-center hover:bg-muted"
                                        >
                                          <div className="relative size-12 overflow-hidden rounded-lg">
                                            <Image
                                              src={node.image}
                                              alt={node.name}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <span className="text-[11px] leading-tight">
                                            {node.name}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <Button
                                  variant={active ? "default" : "ghost"}
                                  className="relative mx-1 mb-1 w-full cursor-pointer justify-start   !py-6"
                                  asChild
                                  onClick={() => {
                                    const isCreateButton = [
                                      "createNode",
                                      "createClub",
                                    ].includes(key || "");
                                    if (!isCreateButton) {
                                      return router.push(href);
                                    }
                                  }}
                                >
                                  <div className="">
                                    <span
                                      className={cn(
                                        isOpen === false ? "" : "mr-4"
                                      )}
                                    >
                                      {label === "Home" ? (
                                        <HomeIcon />
                                      ) : (
                                        <div
                                          className={cn(
                                            "rounded-xl  object-cover relative",
                                            index === 0 &&
                                              groupLabel === "Nodes"
                                              ? "p-[5px] bg-primary/80 -ml-[5px]"
                                              : ""
                                          )}
                                        >
                                          <Image
                                            src={image}
                                            height={50}
                                            width={50}
                                            className={cn(
                                              "size-9 rounded-lg  object-cover",
                                              [
                                                "createNode",
                                                "createClub",
                                              ].includes(key || "")
                                                ? "brightness-50"
                                                : ""
                                            )}
                                            alt={label}
                                          />
                                          {[
                                            "createNode",
                                            "createClub",
                                          ].includes(key || "") && (
                                            <Plus
                                              size={"2rem"}
                                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  font-extrabold text-white"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </span>
                                    <span
                                      hidden={!isOpen}
                                      className={cn(
                                        "max-w-[200px] truncate",
                                        isOpen === false
                                          ? "-translate-x-96 opacity-0"
                                          : "translate-x-0 opacity-100 "
                                      )}
                                    >
                                      {label}
                                    </span>
                                  </div>
                                  {/* Active marker */}
                                </Button>
                              )}
                            </TooltipTrigger>
                            {isOpen === false && (
                              <TooltipContent side="right">
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                        {index === 0 && groupLabel === "Nodes" && (
                          <span className="absolute -left-2 top-1.5 h-9 w-2 rounded-r-md bg-primary/80"></span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full" key={index}>
                        {/* <CollapseMenuButton
                      icon={HamburgerMenuIcon}
                      label={label}
                      active={active}
                      submenus={submenus}
                      isOpen={isOpen}
                    /> */}
                      </div>
                    )
                )}

                <div className="h-0.5 w-full bg-gray-300/50"></div>
              </li>
            ))}
          <li className="flex w-full grow items-end ">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    className="mt-5 h-10 w-full justify-center"
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
