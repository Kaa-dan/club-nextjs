import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface Module {
  link: string;
  name: string;
  icon: string;
  notifications?: number;
}

interface ModulesBarProps {
  forumId: string;
  forum: TForum;
  plugin?: TPlugins;
}

const ModulesBar: React.FC<ModulesBarProps> = ({ forumId, plugin, forum }) => {
  const pathname = usePathname();
  const isChapterPath = pathname.includes("/chapters/");

  // Extract nodeId and chapterId if in chapter path
  const getBasePath = () => {
    if (!isChapterPath) return `/${forum}/${forumId}`;

    const pathParts = pathname.split("/");
    const nodeIndex = pathParts.indexOf("node");
    const chapterIndex = pathParts.indexOf("chapters");

    if (nodeIndex === -1 || chapterIndex === -1) return `/${forum}/${forumId}`;

    return `${pathParts.slice(0, chapterIndex + 2).join("/")}`;
  };

  const modules: Module[] = [
    {
      link: "rules",
      name: "Rules",
      icon: plugin === "rules" ? ICONS.BarRulesIconGreen : ICONS.BarRulesIcon,
      notifications: 8,
    },
    {
      link: "issues",
      name: "Issues",
      icon:
        plugin === "issues" ? ICONS.BarIssuesIconGreen : ICONS.BarIssuesIcon,
    },
    {
      link: "debate",
      name: "Debate",
      icon:
        plugin === "debate" ? ICONS.BarDebateIconGreen : ICONS.BarDebateIcon,
    },
    {
      link: "projects",
      name: "Projects",
      icon: ICONS.BarFunnyIcon,
    },
  ];

  const basePath = getBasePath();

  return (
    <div className="mb-2 ml-5 flex w-10/12 max-w-screen-lg items-center overflow-x-auto rounded-lg bg-white p-4 text-xs shadow-md">
      {modules.map((module, index) => (
        <Link key={index} href={`${basePath}/${module.link}`}>
          <div className="relative flex h-11 cursor-pointer flex-col items-center justify-end gap-2 rounded-sm p-1 px-4 hover:bg-slate-50">
            <div className="relative size-fit">
              <Image
                src={module.icon}
                alt={`${module.name} icon`}
                width={16}
                height={16}
              />
              {module.notifications && (
                <Badge className="absolute -right-4 -top-4 flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                  {module.notifications}
                </Badge>
              )}
            </div>
            <p className="text-gray-700">{module.name}</p>
          </div>
        </Link>
      ))}

      <div className="flex flex-col items-center text-green-500">
        <button className="flex items-center">
          <Plus />
        </button>
        <p className="mt-1 text-sm">Add Module</p>
      </div>
    </div>
  );
};

export default ModulesBar;
