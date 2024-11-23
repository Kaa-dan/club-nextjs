"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Calendar, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Endpoints } from "@/utils/endpoint";
import { useParams } from "next/navigation";
import ReactQuill from "react-quill-new";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DialogHeader } from "@/components/ui/dialog";

import { url } from "inspector";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  topic: z.string().min(1, "Debate topic is required"),
  closingDate: z.string().optional(),
  significance: z.string().min(1, "Significance is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  tags: z.array(z.string()),
  openingCommentsFor: z.string().min(1, "Opening comments (For) are required"),
  openingCommentsAgainst: z
    .string()
    .min(1, "Opening comments (Against) are required"),
  isPublic: z.boolean().default(false),
  files: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DebateForm = ({
  section,
  nodeOrClubId,
}: {
  section: "club" | "node";
  nodeOrClubId: string;
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      closingDate: "",
      significance: "",
      targetAudience: "",
      tags: [],
      openingCommentsFor: "",
      openingCommentsAgainst: "",
      isPublic: false,
      files: [],
    },
  });

  const [open, setOpen] = useState<boolean>(false);
  // Form submission
  const onSubmit = async (data: FormValues) => {
    try {
      console.log({ debate: data });

      const formDataToSend = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        console.log({ key });

        if (key === "tags" && Array.isArray(value)) {
          // Convert the array of tags into a JSON string
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key !== "files") {
          formDataToSend.append(key, value.toString());
        }
      });

      data?.files?.forEach((fileObj: any) => {
        console.log(fileObj.file);

        formDataToSend.append("files", fileObj);
      });

      formDataToSend.append(section, nodeOrClubId);

      // Uncomment to send the data
      const response = await Endpoints.postDebate(formDataToSend);
      toast.success(response.message || "Debate successfully created");

      router.push(`/${section}/${nodeOrClubId}/debate`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit debate. Please try again.");
    } finally {
      setOpen(false);
      form.reset();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      form.setValue("files", [...files, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    form.setValue("files", updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-blue-500");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500");
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
    form.setValue("files", [...files, ...droppedFiles]);
  };
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      form.setValue("tags", [...form.getValues("tags"), tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      form.getValues("tags").filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => setOpen(true))}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Debate Topic
                      <div className="ml-1 text-gray-400">ⓘ</div>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Closing date
                      <div className="ml-1 text-gray-400">ⓘ</div>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type="date" className="h-9 pl-10" />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="significance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Significance
                      <div className="ml-1 text-gray-400">ⓘ</div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[80px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Target Audience
                      <div className="ml-1 text-gray-400">ⓘ</div>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Tags
                      <div className="ml-1 text-gray-400">ⓘ</div>
                    </FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="Type a tag and press Enter"
                          className="h-9 mb-2"
                        />
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                            >
                              <span className="text-sm">{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Files/Media
                      <div className="ml-1 text-gray-400">ⓘ</div>
                    </FormLabel>
                    <FormControl>
                      <div
                        className="border-2 border-dashed rounded-lg p-4 text-center text-gray-500 cursor-pointer transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("file-input")?.click()
                        }
                      >
                        <input
                          id="file-input"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        + Drag or Upload a file
                      </div>
                    </FormControl>
                    <FormMessage />
                    {files.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {files.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="border rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="relative h-32 w-full mb-2">
                                <Image
                                  width={40}
                                  height={40}
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="rounded-md object-cover w-full h-full"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="text-sm font-medium truncate">
                                  {file.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="openingCommentsFor"
                control={form.control}
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <FormLabel className="flex items-center">
                        CommentsFor
                        <div className="ml-1 text-gray-400">ⓘ</div>
                      </FormLabel>
                      <ReactQuill
                        theme="snow"
                        placeholder="Write something amazing..."
                        {...field}
                        onChange={(content) => field.onChange(content)}
                      />
                    </FormItem>
                    {/* Uncomment and update error handling when needed */}
                    {/* {errors.openingCommentsFor && (
          <p className="mt-2 text-sm text-red-500">
            {errors.openingCommentsFor.message}
          </p>
        )} */}
                  </div>
                )}
              />

              <Controller
                name="openingCommentsAgainst"
                control={form.control}
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <FormLabel className="flex items-center">
                        CommentsAgainst
                        <div className="ml-1 text-gray-400">ⓘ</div>
                      </FormLabel>
                      <ReactQuill
                        id=""
                        theme="snow"
                        placeholder="Write something amazing..."
                        {...field}
                        onChange={(content) => field.onChange(content)}
                      />
                      {/* {errors. && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )} */}
                    </FormItem>
                  </div>
                )}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Make this Debate public
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <Button
                  disabled={form.formState.isSubmitting}
                  type="button"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
                <Button
                  disabled={form.formState.isSubmitting}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Handle save draft logic
                  }}
                >
                  Save draft
                </Button>
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  Publish
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Debate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this Debate?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={form.formState.isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default DebateForm;
