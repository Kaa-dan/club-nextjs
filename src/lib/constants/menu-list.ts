type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  image: string;
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
          image: "https://picsum.photos/200",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Nodes",
      menus: [
        {
          href: "/my-account",
          label: "My Account",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
        {
          href: "/my-account",
          label: "My Account",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Clubs",
      menus: [
        {
          href: "/my-account",
          label: "My Account",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
      ],
    },
  ];
}
