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

interface FolderPost {
  createdAt: string;
  entity: {
    entityId: string;
    entityType: string;
  };
  _id: string;
}

interface BookmarkFolder {
  _id: string;
  title: string;
  user: string;
  posts: FolderPost[];
  createdAt: string;
  updatedAt: string;
}

export function BookmarkModal({
  postId,
  setOpen,
  postType,
  open,
  fetchPosts,
}: {
  postId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  postType: string;
  open: boolean;
  fetchPosts: () => void;
}) {
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  const isPostInFolder = (folder: BookmarkFolder) => {
    return folder.posts.some((post) => post.entity.entityId === postId);
  };
  console.log({ postType, postId });
  const handleAction = async () => {
    if (selectedFolder) {
      try {
        const response = await Endpoints.addToBookmark(
          postType,
          postId,
          selectedFolder
        );
        const selectedFolderData = folders.find(
          (folder) => folder._id === selectedFolder
        );
        const isAlreadyBookmarked = selectedFolderData
          ? isPostInFolder(selectedFolderData)
          : false;
        toast.success(
          isAlreadyBookmarked ? "Removed from folder" : "Added to folder"
        );
        fetchPosts();
      } catch (error) {
        toast.error("Error updating bookmark");
        console.log({ error });
      } finally {
        setOpen(false);
        setSelectedFolder("");
        console.log({ postType, postId });
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
  }, [open]);

  const getButtonText = () => {
    if (!selectedFolder) return "Select a folder";

    const selectedFolderData = folders.find(
      (folder) => folder._id === selectedFolder
    );
    return selectedFolderData && isPostInFolder(selectedFolderData)
      ? "Remove from folder"
      : "Add to folder";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Bookmark Post</DialogTitle>
          </div>
          <DialogDescription>
            Choose a folder to save this post or create a new one.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[300px] pr-4">
          {folders.map((folder) => (
            <Button
              key={folder._id}
              variant={selectedFolder === folder._id ? "default" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setSelectedFolder(folder._id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Folder
                    className={`${
                      selectedFolder === folder._id
                        ? "text-white"
                        : "text-black"
                    } h-4 w-4`}
                  />
                  <span
                    className={`${
                      selectedFolder === folder._id
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {folder.title}
                  </span>
                </div>
                <Bookmark
                  className={`${
                    selectedFolder === folder._id
                      ? "text-white"
                      : "text-green-500"
                  } h-4 w-4`}
                  fill={isPostInFolder(folder) ? "currentColor" : "none"}
                />
              </div>
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
          <Button
            onClick={handleAction}
            disabled={!selectedFolder}
            variant={
              selectedFolder &&
              folders
                .find((f) => f._id === selectedFolder)
                ?.posts.some((p) => p.entity.entityId === postId)
                ? "destructive"
                : "default"
            }
          >
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
