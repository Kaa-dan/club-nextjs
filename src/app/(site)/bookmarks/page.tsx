"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";

interface BookmarkItem {
  id: string;
  title: string;
  postsCount: number;
  lastUpdated: string;
  color?: string;
}

interface BookmarkProps {
  bookmarks?: BookmarkItem[];
}

const initialBookmarks: BookmarkItem[] = [
  {
    id: "1",
    title: "Lorem ipsum",
    postsCount: 256,
    lastUpdated: "Before 2 days",
    color: "bg-purple-50",
  },
  {
    id: "2",
    title: "Lorem ipsum",
    postsCount: 256,
    lastUpdated: "Before 2 days",
    color: "bg-orange-50",
  },
  // Add more initial bookmarks as needed
];

export const BookmarkManager: React.FC<BookmarkProps> = ({
  bookmarks = initialBookmarks,
}) => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [items, setItems] = useState<BookmarkItem[]>(bookmarks);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: BookmarkItem = {
        id: Date.now().toString(),
        title: newFolderName,
        postsCount: 0,
        lastUpdated: "Just now",
        color: "bg-green-50",
      };
      setItems([...items, newFolder]);
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bookmark</h1>
          <p className="text-sm text-gray-500">
            Below is a preview of the entire bookmarks feed that you can
            customise.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsCreateFolderOpen(true)}
          className="gap-2"
        >
          + Create folder
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${item.color} relative rounded-lg p-4`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.postsCount} Posts • {item.lastUpdated}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Open</DropdownMenuItem>
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Folder name</label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateFolderOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Next</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookmarkManager;
