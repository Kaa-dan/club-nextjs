// components/ModulesBar.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import { Plus } from "lucide-react";

interface Module {
  name: string;
  icon: string;
  notifications?: number;
}

const modules: Module[] = [
  { name: "Rules", icon: ICONS.BarRulesIcon, notifications: 8 },
  { name: "Market Place", icon: ICONS.BarMarketPlaceIcon },
  { name: "Debate", icon: ICONS.BarDebateIcon },
  { name: "Events News", icon: ICONS.BarEventsIcon, notifications: 8 },
  { name: "Funny", icon: ICONS.BarFunnyIcon },
];

const ModulesBar: React.FC = () => {
  return (
    <div className="mx-auto flex w-full justify-evenly overflow-x-auto  rounded-lg bg-white   p-4  text-xs shadow-md">
      {modules.map((module, index) => (
        <div
          key={index}
          className="  relative flex cursor-pointer flex-col items-center rounded-sm p-3 hover:bg-slate-50"
        >
          {/* Icon with Badge */}
          <div className="relative">
            <Image
              src={module.icon}
              alt={`${module.name} icon`}
              width={23} // Increased size for better visual appearance
              height={23}
            />
            {module.notifications && (
              <Badge className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                {module.notifications}
              </Badge>
            )}
          </div>

          {/* Label */}
          <p className="mt-1 whitespace-nowrap text-xs text-gray-700">
            {module.name}
          </p>
        </div>
      ))}

      {/* Add Module Button */}
      <div className="flex flex-col items-center whitespace-nowrap p-3 text-green-500">
        <button className="flex items-center ">
          <Plus />
        </button>
        <p className="mt-1 text-xs">Add Module</p>
      </div>
    </div>
  );
};

export default ModulesBar;
