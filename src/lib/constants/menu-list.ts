"use client";
import { useClubStore } from "@/store/clubs-store";
import { TClub, TNodeData } from "@/types";
import { Endpoints } from "@/utils/endpoint";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  _id?: string;
  label: string;
  active: boolean;
  image: string;
  submenus: Submenu[];
  key?: string;
  href: string;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
  menuItems?: Menu[];
};

export async function getMenuList(
  pathname: string,
  joinedClubs: TClub[],
  joinedNodes: TNodeData[]
): Promise<Group[]> {
  // const response = await Endpoints.fetchAllNodes();

  const clubMenus: Menu[] = joinedClubs?.map((club: any) => ({
    _id: club.club._id, // Store the _id directly
    label: club.club.name, // Assuming clubs have a `name`
    active: pathname.includes(`/club/${club.club._d}`),
    image: club.club.profileImage.url || "https://picsum.photos/200", // Use the club's image if available
    submenus: [],
    href: `/club/${club.club._id}`,
  }));
  const nodeMenus: Menu[] = joinedNodes.map((node: any) => ({
    _id: node._id, // Store the _id directly
    label: node.name, // Assuming clubs have a `name`
    active: pathname.includes(`/node/${node._d}`),
    image: node.profileImage?.url || "https://picsum.photos/200", // Use the node's image if available
    submenus: [],
    href: `/node/${node._id}`,
  }));
  const top3Clubs = clubMenus.slice(0, 3);
  const top3Nodes = nodeMenus.slice(0, 3);
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/home",
          label: "Home",
          active: pathname.includes("/home"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Nodes",
      menuItems: nodeMenus,
      menus: [
        ...top3Nodes,
        {
          href: "",
          key: "createNode",
          label: "Create Node",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Clubs",
      menuItems: clubMenus,
      menus: [
        ...top3Clubs, // Insert fetched club data here without `href`
        {
          key: "createClub",
          label: "Create Club",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          href: "",
          _id: "",
          submenus: [],
        },
      ],
    },
  ];
}
