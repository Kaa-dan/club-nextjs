import { TokensIcon } from "@radix-ui/react-icons";
import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  Link,
  Album,
  Contact,
  PanelRightClose,
  User,
  Contact2,
  Newspaper,
  Key,
  Home,
  HomeIcon,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/home",
          label: "Home",
          active: pathname.includes("/home"),
          icon: HomeIcon,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Node",
      menus: [
        {
          href: "/my-account",
          label: "My Account",
          active: pathname.includes("/my-account"),
          icon: User,
          submenus: [],
        },
        {
          href: "/my-account",
          label: "My Account",
          active: pathname.includes("/my-account"),
          icon: User,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Club",
      menus: [
        {
          href: "/my-account",
          label: "My Account",
          active: pathname.includes("/my-account"),
          icon: User,
          submenus: [],
        },
      ],
    },
  ];
}
