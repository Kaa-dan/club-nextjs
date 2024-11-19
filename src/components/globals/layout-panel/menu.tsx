"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  Ellipsis,
  HomeIcon,
  Icon,
  LogOut,
  Pin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddNodeDialog from "@/components/pages/boarding/node/add-node-dialog";
import AddClubDialog from "@/components/pages/club/create-club/add-club-dialog";
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
import { use, useEffect, useState } from "react";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { boolean } from "zod";
import { pinClub } from "@/components/pages/club/endpoint";
import { toast } from "sonner";
import { useTokenStore } from "@/store/store";
import { Endpoints } from "@/utils/endpoint";
import { useClubStore } from "@/store/clubs-store";
import Link from "next/link";
import { useNodeStore } from "@/store/nodes-store";
import { PopoverClose } from "@radix-ui/react-popover";
import { ClubEndpoints } from "@/utils/endpoints/club";
import { NodeEndpoints } from "@/utils/endpoints/node";
import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface MenuProps {
  isOpen: boolean | undefined;
}
interface PathCheckProps {
  groupLabel: string;
  isNodePath: boolean;
  isClubPath: boolean;
  _id: string;
  nodeId?: string;
  clubId?: string;
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
  const { clearStore } = useTokenStore((state) => state);
  const {
    setUserJoinedClubs,
    userJoinedClubs,
    userRequestedClubs,
    setUserRequestedClubs,
  } = useClubStore((state) => state);
  const {
    setUserJoinedNodes,
    userJoinedNodes,
    setUserRequestedNodes,
    userRequestedNodes,
  } = useNodeStore((state) => state);
  const togglePinClub = async (clubId: string) => {
    try {
      const response = await pinClub(clubId);
      toast.success(response.message);
    } catch (error) {
      console.log({ error });
    }
  };
  const { nodeId, clubId } = useParams<{ nodeId?: string; clubId?: string }>();
  const pathname = usePathname();
  const isNodePath = pathname.includes("node");
  const isClubPath = pathname.includes("club");

  const [menuList, setMenuList] = useState<any[]>();
  const [open, setOpen] = useState<boolean>(false);

  async function fetchJoinedClubsAndNodes() {
    const joinedClubs = await Endpoints.fetchUserJoinedClubs();
    setUserJoinedClubs(joinedClubs);
    const joinedNodes = await Endpoints.fetchUserJoinedNodes();
    setUserJoinedNodes(joinedNodes);
    const requestedClubs = await ClubEndpoints.fetchUserRequestedClubs();
    setUserRequestedClubs(requestedClubs);
    const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
    setUserRequestedNodes(requestedNodes);
  }

  async function fetchMenuList() {
    const _menuList = await getMenuList(
      pathname,
      userJoinedClubs,
      userJoinedNodes,
      userRequestedClubs,
      userRequestedNodes
    );
    setMenuList(_menuList);
    return menuList;
  }

  const router = useRouter();

  const isActivePath = ({
    groupLabel,
    isNodePath,
    isClubPath,
    nodeId,
    clubId,
    _id,
  }: PathCheckProps) => {
    const paths = {
      Nodes: () => isNodePath && nodeId === _id,
      Clubs: () => isClubPath && clubId === _id,
    };

    return paths[groupLabel as keyof typeof paths]?.() || false;
  };

  useEffect(() => {
    fetchJoinedClubsAndNodes();
  }, []);

  useEffect(() => {
    if (userJoinedClubs || userJoinedNodes) fetchMenuList();
  }, [
    userJoinedClubs,
    userJoinedNodes,
    userRequestedClubs,
    userRequestedNodes,
  ]);

  if (!menuList) return;
  return (
    <ScrollArea className=" [&>div>div[style]]:!block">
      <nav className="mt-8 size-full">
        <ul className="  flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1  px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList &&
            menuList?.length > 0 &&
            menuList?.map(
              ({ groupLabel, menus, menuItems, requestedMenuItems }, index) => (
                <li
                  className={cn("w-full ", groupLabel ? "pt-5" : "")}
                  key={index}
                >
                  {(isOpen && groupLabel) || isOpen === undefined ? (
                    <div className="max-w-[248px] truncate  px-4 pb-2 text-sm font-medium text-muted-foreground">
                      {/* {groupLabel} */}
                      {groupLabel === "Nodes" ? (
                        <div className="flex items-center gap-4">
                          <Image
                            src={ICONS.NodeGreyIcon}
                            alt="node_logo"
                            height={50}
                            width={50}
                            className="ml-2 size-6 object-cover"
                          />
                          <div className="text-base font-semibold">Nodes</div>
                        </div>
                      ) : groupLabel === "Clubs" ? (
                        <div className="flex items-center gap-4 text-base">
                          <Image
                            src={ICONS.ClubGreyIcon}
                            alt="club_logo"
                            height={50}
                            width={50}
                            className="ml-2 size-6 object-cover"
                          />
                          <div className="text-base font-semibold">Clubs</div>
                        </div>
                      ) : (
                        <Ellipsis size={30} />
                      )}
                    </div>
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
                                className="size-6 object-cover"
                              />
                            ) : groupLabel === "Clubs" ? (
                              <Image
                                src={ICONS.ClubGreyIcon}
                                alt="club_logo"
                                height={50}
                                width={50}
                                className="size-6 object-cover"
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
                      { href, label, key, image, active, submenus, _id }: any,
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
                                    <PopoverTrigger asChild className="w-full">
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
                                                  "rounded-xl  object-cover relative ",
                                                  isActivePath({
                                                    groupLabel,
                                                    isNodePath,
                                                    isClubPath,
                                                    nodeId,
                                                    clubId,
                                                    _id,
                                                  })
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
                                          {groupLabel}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {groupLabel === "Nodes" && (
                                            <>
                                              <Button
                                                onClick={() => setOpen(true)}
                                              >
                                                Create Node
                                              </Button>
                                              <AddNodeDialog
                                                open={open}
                                                setOpen={setOpen}
                                              />
                                            </>
                                          )}
                                          {groupLabel === "Clubs" && (
                                            <>
                                              <Button
                                                onClick={() => setOpen(true)}
                                              >
                                                Create Club
                                              </Button>
                                              <AddClubDialog
                                                open={open}
                                                setOpen={setOpen}
                                              />
                                            </>
                                          )}
                                          {/* <span
                                          className="text-xs text-primary hover:underline"
                                        >
                                          Create Node {groupLabel}
                                        </span> */}
                                          <PopoverClose>
                                            <div className="p-2">
                                              <X className="size-4" />
                                            </div>
                                          </PopoverClose>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="px-4 pt-2 text-sm font-semibold">
                                          {groupLabel === "Nodes"
                                            ? "Nodes"
                                            : "Clubs"}
                                        </div>
                                        {menuItems?.length > 0 ? (
                                          <div className="grid grid-cols-5 gap-3 p-2">
                                            {menuItems?.map((node: any) => (
                                              <Link
                                                href={`/${
                                                  groupLabel === "Nodes"
                                                    ? "node"
                                                    : "club"
                                                }/${node?._id}`}
                                                key={node._id}
                                                className="flex flex-col items-center gap-1 rounded-lg  p-1 text-center hover:bg-muted"
                                              >
                                                <PopoverClose>
                                                  <ContextMenu>
                                                    <ContextMenuTrigger>
                                                      <div className="relative size-12 overflow-hidden rounded-lg">
                                                        <Image
                                                          src={node?.image}
                                                          alt={
                                                            node?.name ||
                                                            "profile"
                                                          }
                                                          fill
                                                          className="object-cover"
                                                        />
                                                      </div>
                                                    </ContextMenuTrigger>
                                                    <ContextMenuContent>
                                                      <ContextMenuItem>
                                                        <div className="flex w-full cursor-pointer items-center justify-between">
                                                          <div>Pin</div>
                                                          <div>
                                                            <Pin
                                                              onClick={() => {
                                                                if (
                                                                  groupLabel ===
                                                                  "Clubs"
                                                                ) {
                                                                  togglePinClub(
                                                                    node._id
                                                                  );
                                                                } else if (
                                                                  groupLabel ===
                                                                  "Nodes"
                                                                ) {
                                                                  // togglePinNode(node._id);
                                                                }
                                                              }}
                                                              strokeWidth={0.75}
                                                            />
                                                          </div>
                                                        </div>
                                                      </ContextMenuItem>
                                                    </ContextMenuContent>
                                                  </ContextMenu>
                                                </PopoverClose>
                                                <span className="text-[11px] leading-tight">
                                                  {node.name}
                                                </span>
                                              </Link>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="p-10 text-center text-gray-600">
                                            You haven’t joined any {groupLabel}{" "}
                                            yet. Start exploring and join one to
                                            see it here!
                                          </p>
                                        )}
                                        <div className="px-4 pt-2 text-sm font-semibold">
                                          {"Requested "}
                                          {groupLabel === "Nodes"
                                            ? "Nodes"
                                            : "Clubs"}
                                        </div>
                                        {menuItems?.length > 0 ? (
                                          <div className="grid grid-cols-5 gap-3 p-2">
                                            {requestedMenuItems?.map(
                                              (node: any) => (
                                                <Link
                                                  href={`/${
                                                    groupLabel === "Nodes"
                                                      ? "node"
                                                      : "club"
                                                  }/${node?._id}`}
                                                  key={node._id}
                                                  className="flex flex-col items-center gap-1 rounded-lg  p-1 text-center hover:bg-muted"
                                                >
                                                  <PopoverClose>
                                                    <ContextMenu>
                                                      <ContextMenuTrigger>
                                                        <div className="relative size-12 overflow-hidden rounded-lg">
                                                          <Image
                                                            src={node?.image}
                                                            alt={
                                                              node?.name ||
                                                              "profile"
                                                            }
                                                            fill
                                                            className="object-cover"
                                                          />
                                                        </div>
                                                      </ContextMenuTrigger>
                                                      <ContextMenuContent>
                                                        <ContextMenuItem>
                                                          <div className="flex w-full cursor-pointer items-center justify-between">
                                                            <div>Pin</div>
                                                            <div>
                                                              <Pin
                                                                onClick={() => {
                                                                  if (
                                                                    groupLabel ===
                                                                    "Clubs"
                                                                  ) {
                                                                    togglePinClub(
                                                                      node._id
                                                                    );
                                                                  } else if (
                                                                    groupLabel ===
                                                                    "Nodes"
                                                                  ) {
                                                                    // togglePinNode(node._id);
                                                                  }
                                                                }}
                                                                strokeWidth={
                                                                  0.75
                                                                }
                                                              />
                                                            </div>
                                                          </div>
                                                        </ContextMenuItem>
                                                      </ContextMenuContent>
                                                    </ContextMenu>
                                                  </PopoverClose>
                                                  <span className="text-[11px] leading-tight">
                                                    {node.name}
                                                  </span>
                                                </Link>
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <p className="p-10 text-center text-gray-600">
                                            You haven’t joined any {groupLabel}{" "}
                                            yet. Start exploring and join one to
                                            see it here!
                                          </p>
                                        )}
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
                                    <div className="flex">
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
                                              "rounded-xl  object-cover relative ",
                                              isActivePath({
                                                groupLabel,
                                                isNodePath,
                                                isClubPath,
                                                nodeId,
                                                clubId,
                                                _id,
                                              })
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
                                      <ContextMenu>
                                        <ContextMenuTrigger>
                                          <span
                                            hidden={!isOpen}
                                            className={cn(
                                              "max-w-[200px]  truncate",
                                              isOpen === false
                                                ? "-translate-x-96 opacity-0"
                                                : "translate-x-0 opacity-100 "
                                            )}
                                          >
                                            {label}
                                          </span>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                          <ContextMenuItem>
                                            <div className="flex w-full cursor-pointer items-center justify-between">
                                              <div>
                                                <div>Pins</div>
                                              </div>
                                              <Pin
                                                onClick={() => {
                                                  if (groupLabel === "Clubs") {
                                                    togglePinClub(_id);
                                                  } else if (
                                                    groupLabel === "Nodes"
                                                  ) {
                                                    // togglePinNode(_id);
                                                  }
                                                }}
                                                strokeWidth={0.75}
                                              />
                                            </div>
                                          </ContextMenuItem>
                                        </ContextMenuContent>
                                      </ContextMenu>
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
                          {isActivePath({
                            groupLabel,
                            isNodePath,
                            isClubPath,
                            nodeId,
                            clubId,
                            _id,
                          }) && (
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
              )
            )}
          <li className="flex w-full  grow items-end ">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  {/* <Button
                    onClick={() => {
                      clearStore();
                      router.replace("/sign-in");
                    }}
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
                  </Button> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="mt-5 h-10 w-full justify-center"
                      >
                        <span className={cn(isOpen === false ? "" : "mr-4")}>
                          <LogOut size={18} />
                        </span>
                        <p
                          className={cn(
                            "whitespace-nowrap",
                            isOpen === false
                              ? "opacity-0 hidden"
                              : "opacity-100"
                          )}
                        >
                          Sign out
                        </p>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <div className="flex w-full justify-center gap-4">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            clearStore();
                            router.replace("/sign-in");
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
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
