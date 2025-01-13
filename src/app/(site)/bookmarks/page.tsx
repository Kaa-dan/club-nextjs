"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";

import { Form, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Endpoints } from "@/utils/endpoint";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  title: z
    .string()
    .trim() // Automatically trims leading and trailing spaces
    .min(1, { message: "Title is required and cannot be blank" }) // Ensure non-empty
    .refine((value: string) => !/^\s+$/.test(value), {
      message: "Title must not contain only spaces", // Prevent only spaces
    }),
});

export default function BookmarksPage() {
  const form = useForm({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(schema),
  });
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [items, setItems] = useState([]);
  const fetchFolders = () => {
    Endpoints.fetchFolders().then((res) => {
      setItems(res);
    });
  };
  useEffect(() => {
    fetchFolders();
  }, []);

  const onSubmit = async (data: { title: string }) => {
    try {
      const response = await Endpoints.createBookmark(data);

      toast.success(response.message);
      form.reset();
      setIsCreateFolderOpen(false);
      fetchFolders();
    } catch (error) {
      console.log({ error });
      toast.error("error while creating folder");
    }
  };
  const router = useRouter();
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
        {items.map((item: { _id: string; title: string; posts: [] }) => (
          <div
            onClick={() => {
              router.push(`/bookmarks/${item._id}`);
            }}
            key={item._id}
            className={` bg-gray-200 relative rounded-lg p-4`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.posts.length || "0"} Posts •
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
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-2">
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
