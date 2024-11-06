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
    <div className="flex items-center bg-white shadow-md w-fit rounded-lg p-4  max-w-screen-lg mx-auto  overflow-x-auto text-xs">
      {modules.map((module, index) => (
        <div
          key={index}
          className="relative flex flex-col gap-1 items-center px-4 p-1 hover:bg-slate-50 rounded-sm cursor-pointer"
        >
          {/* Icon with Badge */}
          <div className="relative size-fit">
            <Image
              src={module.icon}
              alt={`${module.name} icon`}
              width={16}
              height={16}
            />
            {module.notifications && (
              <Badge className="absolute -top-4 -right-4 bg-orange-500 text-white text-xs rounded-full size-5 flex justify-center items-center">
                {module.notifications}
              </Badge>
            )}
          </div>

          {/* Label */}
          <p className=" text-gray-700 mt-1">{module.name}</p>
        </div>
      ))}

      {/* Add Module Button */}
      <div className="flex flex-col items-center text-green-500">
        <button className="flex items-center">
          <Plus />
        </button>
        <p className="text-sm mt-1">Add Module</p>
      </div>
    </div>
  );
};

export default ModulesBar;
