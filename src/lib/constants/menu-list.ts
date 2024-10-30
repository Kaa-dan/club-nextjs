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
          href: "/nodes/gretchen-lencher",
          label: "Gretchen Lencher",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
        {
          href: "/Aarlene-McCoy",
          label: "Arlene McCoy",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
        {
          href: "/Brooklyn-Simmons",
          label: "Brooklyn Simmons",
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
          href: "/Annette-Black",
          label: "Annette Black",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
        {
          href: "/Cameron-Williamson",
          label: "Cameron Williamson",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
        {
          href: "/Devon-Lane",
          label: "Devon Lane",
          active: pathname.includes("/my-account"),
          image: "https://picsum.photos/200",
          submenus: [],
        },
      ],
    },
  ];
}
