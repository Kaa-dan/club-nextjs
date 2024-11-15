"use client";

import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { flexRender, Row } from "@tanstack/react-table";

interface ExpandableTableRowProps {
  row: Row<any>;
  expandedContent: React.ReactNode;
}

export function ExpandableTableRow<TData>({
  row,
  expandedContent,
}: ExpandableTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(row.original, "row");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className="group cursor-pointer hover:bg-muted/50"
        onClick={toggleExpand}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
        <TableCell>
          <Button variant="ghost" size="sm" className="float-right">
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={row.getVisibleCells().length + 1}>
            <div className="rounded-md bg-muted/30 p-0">{expandedContent}</div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
