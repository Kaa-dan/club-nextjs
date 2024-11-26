"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Ellipsis, HomeIcon, LogOut, Pin, Plus, X } from "lucide-react";
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
import { useEffect, useState } from "react";
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
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { useClubCalls } from "@/components/pages/club/use-club-calls";

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

export function Menu({ isOpen }: MenuProps) {
  const { fetchJoinedClubs, fetchRequestedClubs } = useClubCalls();
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
    const joinedNodes = await Endpoints.fetchUserJoinedNodes();
    setUserJoinedNodes(joinedNodes);
    const requestedNodes = await NodeEndpoints.fetchUserRequestedNodes();
    setUserRequestedNodes(requestedNodes);
    // const joinedClubs = await Endpoints.fetchUserJoinedClubs();
    // setUserJoinedClubs(joinedClubs);
    // const requestedClubs = await ClubEndpoints.fetchUserRequestedClubs();
    // setUserRequestedClubs(requestedClubs);
    fetchJoinedClubs();
    fetchRequestedClubs();
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

  // if (!menuList) return;
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
                                      >
                                        <div className="">
                                          <span
                                            className={cn(
                                              isOpen === false ? "" : "mr-4"
                                            )}
                                          >
                                            <div
                                              className={
                                                "relative  rounded-xl object-cover "
                                              }
                                            >
                                              <Image
                                                src={image}
                                                height={50}
                                                width={50}
                                                className={
                                                  "size-9 rounded-lg  object-cover brightness-50"
                                                }
                                                alt={label}
                                              />
                                              <Plus
                                                size={"2rem"}
                                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  font-extrabold text-white"
                                              />
                                            </div>
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
                                          <PopoverClose>
                                            <div className="p-2">
                                              <X className="size-4" />
                                            </div>
                                          </PopoverClose>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="px-4 pt-2 text-sm font-semibold">
                                          {"Joined "}
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
                                                <span
                                                  className="truncate text-[11px] leading-tight"
                                                  title={node.label}
                                                >
                                                  {node.label}
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
                                        {requestedMenuItems &&
                                        requestedMenuItems?.length > 0 ? (
                                          <>
                                            <div className="px-4 pt-2 text-sm font-semibold">
                                              {"Requested "}
                                              {groupLabel === "Nodes"
                                                ? "Nodes"
                                                : "Clubs"}
                                            </div>
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
                                                      {node?.label}
                                                    </span>
                                                  </Link>
                                                )
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <p className="p-10 text-center text-gray-600">
                                            You haven’t requested any{" "}
                                            {groupLabel} yet. Start exploring
                                            and request one to see it here!
                                          </p>
                                        )}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  <Link href={href}>
                                    <Button
                                      variant={active ? "default" : "ghost"}
                                      className="relative mx-1 mb-1 w-full cursor-pointer justify-start    !py-6"
                                      asChild
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
                                                    if (
                                                      groupLabel === "Clubs"
                                                    ) {
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
                                  </Link>
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
                  <CustomAlertDialog
                    trigger={
                      <Button
                        variant="outline"
                        className="mt-5 h-12 w-full justify-center  gap-2 hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut size={18} />
                        <p
                          className={cn(
                            "whitespace-nowrap",
                            !isOpen && "hidden"
                          )}
                        >
                          Sign out
                        </p>
                      </Button>
                    }
                    title="Sign Out Confirmation"
                    description="Are you sure you want to sign out? You'll need to sign in again to access your account."
                    type="error"
                    actionText="Sign out"
                    cancelText="Cancel"
                    onAction={() => {
                      clearStore();
                      router.replace("/sign-in");
                    }}
                  />
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
