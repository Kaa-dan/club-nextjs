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
    <div className="flex justify-evenly w-[100%] bg-white shadow-md  rounded-lg p-4   mx-auto  overflow-x-auto text-xs">
      {modules.map((module, index) => (
        <div
          key={index}
          className="  relative flex flex-col items-center p-3 hover:bg-slate-50 rounded-sm cursor-pointer"
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
              <Badge className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center">
                {module.notifications}
              </Badge>
            )}
          </div>

          {/* Label */}
          <p className="text-xs text-gray-700 mt-1 whitespace-nowrap">
            {module.name}
          </p>
        </div>
      ))}

      {/* Add Module Button */}
      <div className="flex flex-col items-center whitespace-nowrap text-green-500 p-3">
        <button className="flex items-center ">
          <Plus />
        </button>
        <p className="text-xs mt-1">Add Module</p>
      </div>
    </div>
  );
};

export default ModulesBar;
