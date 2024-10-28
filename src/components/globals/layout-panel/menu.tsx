"use client";

import Link from "next/link";
import { Ellipsis, Icon, LogOut } from "lucide-react";
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
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-fit", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
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
                  <div className="w-full" key={index}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={active ? "default" : "ghost"}
                            className="mb-1 w-full justify-start"
                            asChild
                          >
                            <Link href={href}>
                              <span
                                className={cn(isOpen === false ? "" : "mr-4")}
                              >
                                <Image
                                  src={image}
                                  height={50}
                                  width={50}
                                  className="size-9 object-cover rounded-md"
                                  alt={label}
                                />
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
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && (
                          <TooltipContent side="right">{label}</TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full" key={index}>
                    {/* <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={active}
                      submenus={submenus}
                      isOpen={isOpen}
                    /> */}
                  </div>
                )
              )}
            </li>
          ))}
          <li className="flex w-full grow items-end">
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
