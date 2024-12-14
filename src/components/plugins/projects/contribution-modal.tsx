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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { ProjectApi } from "./projectApi";

const formSchema = z.object({
  volunteers: z.number().min(1, "Please enter a value greater than 0"),
  remarks: z.string().min(1, "Remarks are required."),
  files: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one file.")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "File size must be less than 5MB."
    )
    .refine(
      (files) => files.every((file) => file.type.startsWith("image/")),
      "Only image files are allowed."
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContributionModal({
  projectId,

  fetch,
  open,
  setOpen,
  forumId,
  forum,
  param,
}: {
  projectId: string;

  open: boolean;
  setOpen: (open: boolean) => void;
  forumId: string;
  forum: TForum;
  fetch: (postId: string) => void;
  param: {
    _id: string;
  };
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volunteers: 0,
      remarks: "",
      files: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("value", values.volunteers.toString());
    formData.append("remarks", values.remarks);

    values.files.forEach((file) => {
      formData.append("file", file);
    });

    formData.append("rootProject", projectId);
    formData.append("parameter", param._id);
    formData.append(forum, forumId);

    try {
      await ProjectApi.contribute(formData);
      fetch(projectId);
      toast.success("Contribution added successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add contribution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files);
      form.setValue("files", [...form.getValues("files"), ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const currentFiles = form.getValues("files");
    const updatedFiles = currentFiles.filter(
      (_, index) => index !== indexToRemove
    );
    form.setValue("files", updatedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    const currentFiles = form.getValues("files");
    form.setValue("files", [...currentFiles, ...newFiles]);
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
                    Value
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
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center gap-1">
                    Files/Media
                    <Info className="size-4 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div
                        className="cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors hover:bg-muted/50"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <Input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          multiple
                          accept="image/*"
                        />
                        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
                          <Upload className="size-6" />
                          <span>+ Drag or Upload a file</span>
                        </div>
                      </div>

                      {field.value && field.value.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {field.value.map((file, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                width={100}
                                height={100}
                                className="h-24 w-full rounded-lg object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -right-2 -top-2 size-6"
                                onClick={() => removeFile(index)}
                              >
                                <X className="size-3" />
                              </Button>
                              <p className="mt-1 truncate text-xs">
                                {file.name}
                              </p>
                            </div>
                          ))}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
