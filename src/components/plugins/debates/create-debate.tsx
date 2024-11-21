"use client";

import React from "react";
import { Controller } from "react-hook-form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import router from "next/navigation";
import { useRouter } from "next/router";

const formSchema = z.object({
  topic: z.string().min(1, "Debate topic is required"),
  closingDate: z.string().optional(),
  significance: z.string().min(1, "Significance is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  tags: z.string().optional(),
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
  const router = useRouter;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      closingDate: "",
      significance: "",
      targetAudience: "",
      tags: "",
      openingCommentsFor: "",
      openingCommentsAgainst: "",
      isPublic: false,
      files: [],
    },
  });
  // Form submission
  const onSubmit = async (data: FormValues) => {
    try {
      console.log({ debate: data });

      const formDataToSend = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        console.log({ key });

        if (key !== "files") {
          formDataToSend.append(key, value.toString());
        }
      });

      data?.files?.forEach((fileObj: any) => {
        console.log(fileObj.file);

        formDataToSend.append("files", fileObj);
      });

      formDataToSend.append(section, nodeOrClubId);

      const response = await Endpoints.postDebate(formDataToSend);
      toast.success(response.message || "Rules successfully created");

      // Clean up previews before reset
      //   data.files?.forEach((fileObj) => {
      //     if (fileObj.preview) {
      //       URL.revokeObjectURL(fileObj.preview);
      //     }
      //   });
      router.push(`/${section}/${nodeOrClubId}/debate`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit rule. Please try again.");
    } finally {
      // setIsAlertOpen(false);
      // reset();
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

  return (
    <Card className="max-w-5xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      Closing date if any
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
                      <Input {...field} className="h-9" />
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
                            <div className="border rounded-lg p-2 bg-gray-50 text-xs">
                              <div className="truncate">{file.name}</div>
                              <div className="text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
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
                  </div>
                )}
              />

              <Controller
                name="openingCommentsAgainst"
                control={form.control}
                render={({ field }) => (
                  <div>
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
                  type="button"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Handle save draft logic
                  }}
                >
                  Save draft
                </Button>
                <Button
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
    </Card>
  );
};

export default DebateForm;
