import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterComponentProps = {
  onSortChange: (value: string) => void;
};

export function FilterComponent({ onSortChange }: FilterComponentProps) {
  return (
    <Select onValueChange={onSortChange}>
      <SelectTrigger className="w-[180px] border-none">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevantDesc">Most Relevant</SelectItem>
        <SelectItem value="relevantAsc">Least Relevant</SelectItem>
        <SelectItem value="timeDesc">Newest</SelectItem>
        <SelectItem value="timeAsc">Oldest</SelectItem>
        <SelectItem value="reset">Reset</SelectItem> {/* Reset option */}
      </SelectContent>
    </Select>
  );
}
