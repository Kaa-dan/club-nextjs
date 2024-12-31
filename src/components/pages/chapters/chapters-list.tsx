"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateChapterModal from "./create-chapter-modal";
import Image from "next/image";
import { withTokenAxios } from "@/lib/mainAxios";
import { useParams } from "next/navigation";
import { TChapter } from "@/types";
import { useChapterStore } from "@/store/chapters-store";

export function ChaptersList() {
  const { publishedChapters } = useChapterStore((state) => state);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [chapters, setChapters] = React.useState<TChapter[]>([]);
  const [filteredChapters, setFilteredChapters] =
    React.useState<TChapter[]>(publishedChapters);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);

  React.useEffect(() => {
    const filtered = publishedChapters.filter((chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChapters(filtered);
  }, [searchQuery, chapters]);

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
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search for chapters..."
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
            <DropdownMenuItem>Filter by Date</DropdownMenuItem>
            <DropdownMenuItem>Filter by Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredChapters.map((chapter) => (
          <Card key={chapter._id} className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                height={500}
                width={500}
                src={chapter?.profileImage?.url}
                alt={`${chapter.name} placeholder`}
                className="h-32 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="truncate font-semibold">{chapter.name}</h3>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(chapter.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            {/* <CardFooter className="p-4 pt-0">
              <p className="text-xs text-muted-foreground">
                Status: {chapter.status}
              </p>
            </CardFooter> */}
          </Card>
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No chapters found matching your search.
        </div>
      )}
    </div>
  );
}
