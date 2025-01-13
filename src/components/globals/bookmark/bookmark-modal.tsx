"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, Plus, Bookmark } from "lucide-react";
import { Endpoints } from "@/utils/endpoint";
import { toast } from "sonner";
// This would typically come from your backend or state management

export function BookmarkModal({
  postId,
  setOpen,
  postType,
  open,
}: {
  postId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  postType: string;
  open: boolean;
}) {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  console.log({ postType });
  // const handleCreateFolder = () => {
  //   if (newFolderName.trim()) {
  //     const newFolder = {
  //       id: folders.length + 1,
  //       name: newFolderName.trim(),
  //     };
  //     setFolders([...folders, newFolder]);
  //     setNewFolderName("");
  //     setSelectedFolder(newFolder.id);
  //   }
  // };

  const handleBookmark = async () => {
    if (selectedFolder) {
      try {
        const response = await Endpoints.addToBookmark(
          postType,
          postId,
          selectedFolder
        );
        toast.success(response.message);
      } catch (error) {
        toast.error("error adding to bookmark");
        console.log({ error });
      } finally {
        setOpen(false);
        setSelectedFolder("");
      }
    }
  };

  useEffect(() => {
    Endpoints.fetchFolders()
      .then((res) => {
        setFolders(res);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bookmark Post</DialogTitle>
          <DialogDescription>
            Choose a folder to save this post or create a new one.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[300px] pr-4">
          {folders.map((folder: { _id: string; title: string }) => (
            <Button
              key={folder._id}
              variant={selectedFolder == folder._id ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setSelectedFolder(folder._id)}
            >
              <Folder
                className={`${selectedFolder === folder._id ? "text-white" : "text-black"} mr-2 h-4 w-4`}
              />
              <span
                className={`${selectedFolder === folder._id ? "text-white" : "text-black"}`}
              >
                {folder.title}
              </span>
            </Button>
          ))}
        </ScrollArea>
        <div className="flex items-center mt-4">
          <Input
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="mr-2"
          />
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleBookmark} disabled={!selectedFolder}>
            Bookmark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
