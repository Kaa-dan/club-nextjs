"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Info,
  X,
  Upload,
  FileIcon,
  ImageIcon,
  FileTextIcon,
} from "lucide-react";
import Image from "next/image";
import { ProjectApi } from "./projectApi";
import { log } from "console";

// Validation Schema
const formSchema = z.object({
  volunteers: z.number().min(1, "Please enter a value greater than 0"),
  files: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, "Please upload at least one file.")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "File size must be less than 5MB."
    )
    .refine(
      (files) =>
        files.every(
          (file) =>
            file.type.startsWith("image/") || file.type === "application/pdf"
        ),
      "Only image files and PDF files are allowed."
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContributionModal({
  projectId,
  parameterId,
  open,
  setOpen,
  forumId,
  forum,
}: {
  projectId: string;
  parameterId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  forumId: string;
  forum: TForum;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volunteers: 0,
      files: [],
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log({ values });
    // Create a new FormData object
    const formData = new FormData();
    formData.append("value", values.volunteers.toString());

    // Append files to FormData
    values.files.forEach((file) => {
      formData.append("files", file); // This appends each file under the "files" field
    });

    // Add the projectId and parameterId to the FormData
    formData.append("rootProject", projectId);
    formData.append("parameter", parameterId);
    formData.append(forum, forumId);

    // Call your API
    ProjectApi.contribute(formData)
      .then((res) => {
        console.log({ res });
        toast.success("Contribution added!");
      })
      .catch((err) => {
        toast.error("Something went wrong!");
      });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      form.setValue("files", Array.from(event.dataTransfer.files));
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="size-6" />;
    if (fileType === "application/pdf")
      return <FileTextIcon className="size-6" />;
    return <FileIcon className="size-6" />;
  };

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <Image
          src={URL.createObjectURL(file)}
          alt={file.name}
          width={40}
          height={40}
          className="rounded object-cover"
        />
      );
    }
    return getFileIcon(file.type);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add Contribution</DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="volunteers"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-1">
                    Volunteers
                    <Info className="size-4 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Value"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-1">
                    Files/Media
                    <Info className="size-4 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <div
                      className="cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors hover:bg-muted/50"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) =>
                          field.onChange(
                            e.target.files ? Array.from(e.target.files) : []
                          )
                        }
                        className="hidden"
                        multiple
                      />
                      {field.value && field.value.length > 0 ? (
                        <ul className="space-y-2">
                          {field.value.map((file, index) => (
                            <li key={index} className="flex items-center gap-2">
                              {renderFilePreview(file)}
                              <span className="truncate text-sm">
                                {file.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
                          <Upload className="size-6" />
                          <span>+ Drag or Upload a file</span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
