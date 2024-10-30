"use client";

import Link from "next/link";
import { Ellipsis, HomeIcon, Icon, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { CollapseMenuButton } from "./collapse-menu-button";
import { getMenuList } from "@/lib/constants/menu-list";
import Image from "next/image";
import { ICONS } from "@/lib/constants";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <ScrollArea className=" [&>div>div[style]]:!block">
      <nav className="mt-8 size-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1  px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full ", groupLabel ? "pt-5" : "")} key={index}>
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
              {menus.map(({ href, label, image, active, submenus }, index) =>
                submenus.length === 0 ? (
                  <div className="relative w-full " key={index}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={active ? "default" : "ghost"}
                            className="relative mx-1 mb-1 w-full justify-start   !py-6"
                            asChild
                          >
                            <Link href={href}>
                              <span
                                className={cn(isOpen === false ? "" : "mr-4")}
                              >
                                {label === "Home" ? (
                                  <HomeIcon />
                                ) : (
                                  <div
                                    className={cn(
                                      "rounded-xl  object-cover",
                                      index === 0 && groupLabel === "Nodes"
                                        ? "p-[5px] bg-primary/80 -ml-[5px]"
                                        : ""
                                    )}
                                  >
                                    <Image
                                      src={image}
                                      height={50}
                                      width={50}
                                      // className="size-9 rounded-md border-[5px] border-primary object-cover"
                                      className={cn(
                                        "size-9 rounded-lg  object-cover"
                                      )}
                                      alt={label}
                                    />
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
                            </Link>
                            {/* Active marker */}
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && (
                          <TooltipContent side="right">{label}</TooltipContent>
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
