"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateChapterModal from "./create-chapter-modal";
import Image from "next/image";

interface Item {
  id: string;
  name: string;
  memberCount: number;
  location: string;
  avatar: string;
}

interface ItemGridProps {
  items: Item[];
}

export function ChaptersList({ items }: ItemGridProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState(items);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);

  React.useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const exampleClubs = [
    { id: "1", name: "Manchester United" },
    { id: "2", name: "Real Madrid" },
    { id: "3", name: "Bayern Munich" },
    { id: "4", name: "Barcelona" },
    { id: "5", name: "Liverpool" },
  ];

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-2xl font-bold">All Chapters</h1>
        <Button
          onClick={() => setOpenCreateModal(true)}
          variant="outline"
          size="default"
        >
          Create Chapter
        </Button>
        {openCreateModal && (
          <CreateChapterModal
            open={openCreateModal}
            onOpenChange={setOpenCreateModal}
            clubs={exampleClubs}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={`Search for chapters...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Search className="size-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Filter by Location</DropdownMenuItem>
            <DropdownMenuItem>Filter by Members</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                height={500}
                width={500}
                src={item.avatar}
                alt={`${item.name} avatar`}
                className="h-32 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="truncate font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.memberCount} members
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <p className="text-xs text-muted-foreground">
                📍 {item.location}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No chapters found matching your search.
        </div>
      )}
    </div>
  );
}
