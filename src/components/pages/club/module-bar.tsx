import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Module {
  link: string;
  name: string;
  icon: string;
  notifications?: number;
}

const ModulesBar: React.FC<{ clubId: string; plugin?: TPlugins }> = ({
  clubId,
  plugin,
}) => {
  const modules: Module[] = [
    {
      link: "rules",
      name: "Rules",
      icon: plugin === "rules" ? ICONS.BarRulesIconGreen : ICONS.BarRulesIcon,
      notifications: 8,
    },
    {
      link: "issues",
      name: "issues",
      icon:
        plugin === "issues" ? ICONS.BarIssuesIconGreen : ICONS.BarIssuesIcon,
    },
    { link: "market", name: "Market Place", icon: ICONS.BarMarketPlaceIcon },
    { link: "debate", name: "Debate", icon: ICONS.BarDebateIcon },
    {
      link: "events",
      name: "Events News",
      icon: ICONS.BarEventsIcon,
      notifications: 8,
    },
  ];
  const router = useRouter();
  return (
    <div className="mx-auto mb-2 flex w-fit max-w-screen-lg items-center overflow-x-auto rounded-lg  bg-white p-4  text-xs shadow-md">
      {modules.map((module, index) => (
        <div
          onClick={() => {
            router.push(`/club/${clubId}/${module.link}`);
          }}
          key={index}
          className="relative flex cursor-pointer flex-col items-center gap-1 rounded-sm  p-1 px-4 hover:bg-slate-50"
        >
          {/* Icon with Badge */}
          <div className="relative size-fit ">
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

          {/* Label */}
          <p className=" mt-1 text-gray-700">{module.name}</p>
        </div>
      ))}

      {/* Add Module Button */}
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
