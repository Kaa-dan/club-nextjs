"use client";
import { FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

interface TooltipLabelProps {
  label: string;
  tooltip: string;
}

const TooltipLabel: React.FC<TooltipLabelProps> = ({ label, tooltip }) => (
  <FormLabel className="flex items-center gap-2">
    {label}
    <Popover>
      <PopoverTrigger>
        <Info className="size-4 text-gray-500" />
      </PopoverTrigger>
      <PopoverContent>{tooltip}</PopoverContent>
    </Popover>
  </FormLabel>
);

export default TooltipLabel;
