"use client";

import React, { useCallback, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Info, Upload, X, FileIcon } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Custom Components
import { BreadcrumbItemType } from "@/components/globals/breadcrumb-component";

// Store
import { useClubStore } from "@/store/clubs-store";
import { useNodeStore } from "@/store/nodes-store";

// Utils
import { Endpoints } from "@/utils/endpoint";
import { usePermission } from "@/lib/use-permission";

// Constants
const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5 MB
  MAX_COUNT: 5,
  ACCEPTED_TYPES: [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ] as const,
};

// Types
interface FileWithPreview {
  file: File;
  preview?: string;
}

interface RuleFormProps {
  forumId: string;
  forum: TForum;
}

// Schema
const formSchema = z.object({
  title: z.string().min(1, "Rule title is required"),
  domain: z.string().min(1, "Domain is required"),
  category: z.string().min(1, "Category is required"),
  applicableFor: z.string().min(1, "Applicable for is required"),
  significance: z.string().min(1, "Significance is required"),
  tags: z.array(z.string()).min(1, "Tags cannot be empty"),
  description: z
    .string()
    .min(1, "Rule description is required")
    .refine((val) => val !== "<p><br></p>" && val.trim() !== "", {
      message: "Description cannot be empty.",
    }),
  isPublic: z.boolean(),
  files: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine(
            (file) => file.size <= FILE_CONSTRAINTS.MAX_SIZE,
            `File size should be less than 5MB`
          )
          .refine(
            (file) =>
              FILE_CONSTRAINTS.ACCEPTED_TYPES.includes(file.type as any),
            `File type must be one of: ${FILE_CONSTRAINTS.ACCEPTED_TYPES.join(", ")}`
          ),
        preview: z.string().optional(),
      })
    )
    .max(
      FILE_CONSTRAINTS.MAX_COUNT,
      `You can only upload up to ${FILE_CONSTRAINTS.MAX_COUNT} files`
    )
    .optional()
    .default([]),
});

type FormData = z.infer<typeof formSchema>;

export default function RuleForm({ forumId, forum }: RuleFormProps) {
  // Hooks
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { currentUserRole: clubUserRole } = useClubStore();
  const { currentUserRole: nodeUserRole } = useNodeStore();
  const { hasPermission } = usePermission();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      domain: "",
      category: "",
      applicableFor: "",
      significance: "",
      tags: [],
      description: "",
      isPublic: false,
      files: [],
    },
  });

  const files = watch("files") || [];
  const tags = watch("tags");
  console.log({ tags });
  console.log({ formerr: errors });
  // File handling
  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const currentFiles = files;
      if (currentFiles.length + newFiles.length > FILE_CONSTRAINTS.MAX_COUNT) {
        toast.warning(
          `You can only upload a maximum of ${FILE_CONSTRAINTS.MAX_COUNT} files.`
        );
        return;
      }

      const filesWithPreviews = newFiles.map((file) => ({
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      setValue("files", [...currentFiles, ...filesWithPreviews], {
        shouldValidate: true,
      });
    },
    [files, setValue]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const currentFiles = [...files];
      const fileToRemove = currentFiles[index];

      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      currentFiles.splice(index, 1);
      setValue("files", currentFiles, { shouldValidate: true });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [files, setValue]
  );

  // Tag handling
  const handleAddTag = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      setValue("tags", [...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  // Form submission
  const onSubmit = async (data: FormData) => {
    try {
      const formDataToSend = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "files") {
          formDataToSend.append(key, value.toString());
        }
      });

      data?.files?.forEach((fileObj: any) => {
        formDataToSend.append("file", fileObj.file);
      });

      formDataToSend.append(forum, forumId);

      const response = await Endpoints.addRulesAndRegulations(formDataToSend);
      toast.success(response.message || "Rules successfully created");

      // Clean up previews
      data.files?.forEach((fileObj) => {
        if (fileObj.preview) {
          URL.revokeObjectURL(fileObj.preview);
        }
      });

      router.push(`/${forum}/${forumId}/rules`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit rule. Please try again.");
    }
  };

  const handleSaveDraft = async () => {
    const data = getValues();
    const formDataToSend = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "files") {
        formDataToSend.append(key, value.toString());
      }
    });

    data.files?.forEach((fileObj: any) => {
      formDataToSend.append("file", fileObj.file);
    });

    formDataToSend.append(forum, forumId);

    formDataToSend.append("publishedStatus", "draft");

    try {
      //sending request
      const response = await Endpoints.saveDraft(formDataToSend);
      console.log({ response });
      if (response.success) {
        toast.success("saved to draft successfully");
        router.push(`/${forum}/${forumId}/rules`);
      }
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  const isMember =
    (forum === "club" && clubUserRole === "member") ||
    (forum === "node" && nodeUserRole === "member");

  return (
    <Card className="min-w-full max-w-3xl p-6">
      <form
        onSubmit={handleSubmit(() => setIsAlertOpen(true))}
        className="space-y-4"
      >
        {/* Title and Domain */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Label htmlFor="title">Title</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-white">Add title for your rule</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} id="title" placeholder="Enter rule" />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Label htmlFor="domain">Domain</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-white">Add a domain for your rule</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Controller
              name="domain"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="Select Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domain1">Domain 1</SelectItem>
                    <SelectItem value="domain2">Domain 2</SelectItem>
                    <SelectItem value="domain3">Domain 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.domain && (
              <p className="text-sm text-red-500">{errors.domain.message}</p>
            )}
          </div>
        </div>

        {/* Category and Applicable For */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Label htmlFor="category">Category</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-white">Add category for your rule</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Input {...field} id="category" placeholder="Enter Category" />
              )}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Label htmlFor="applicableFor">Applicable for?</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-white">Applicable for?</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Controller
              name="applicableFor"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="applicableFor"
                  placeholder="Applicable for?"
                />
              )}
            />
            {errors.applicableFor && (
              <p className="text-sm text-red-500">
                {errors.applicableFor.message}
              </p>
            )}
          </div>
        </div>

        {/* Significance and Tags */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Label htmlFor="significance">Significance</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-white">Enter Significance</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Controller
              name="significance"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="significance"
                  placeholder="Enter Significance"
                />
              )}
            />
            {errors.significance && (
              <p className="text-sm text-red-500">
                {errors.significance.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-white">Enter Tags for your rule</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <div className="flex min-h-[40px] flex-wrap items-center gap-1 rounded-md border border-input bg-background p-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-secondary-foreground flex items-center rounded bg-gray-300 px-1.5 py-0.5 text-xs"
                >
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="size-3" />
                    <span className="sr-only">Remove {tag}</span>
                  </Button>
                </span>
              ))}
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Enter Tags"
                className="h-6 flex-1 border-0 px-1 text-sm"
              />
            </div>
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-4 cursor-pointer text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-white">
                    Enter a detailed description of your project or task
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <ReactQuill
                  id="description"
                  theme="snow"
                  placeholder="Write something amazing..."
                  {...field}
                  onChange={(content) => field.onChange(content)}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Label htmlFor="file-upload">
                Files/Media
                <span className="ml-2 text-xs text-muted-foreground">
                  (JPEG, PNG, PDF, DOCX, Excel)
                </span>
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-4 cursor-pointer text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-white">
                    Upload files or media for your rule
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="rounded-lg border-2 border-dashed p-6 text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              accept={FILE_CONSTRAINTS.ACCEPTED_TYPES.join(",")}
            />
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <Upload className="size-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                + Drag or Upload files (max {FILE_CONSTRAINTS.MAX_COUNT} files,{" "}
                {FILE_CONSTRAINTS.MAX_SIZE / (1024 * 1024)}MB each)
              </span>
            </label>
          </div>

          {errors.files?.[0]?.file?.message && (
            <p className="text-sm text-red-500">
              {errors.files[0].file.message}
            </p>
          )}
          {files.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {files.map((fileObj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex items-center space-x-2">
                    {fileObj.file.type.startsWith("image/") &&
                    fileObj.preview ? (
                      <Image
                        src={fileObj.preview}
                        alt={`Preview of ${fileObj.file.name}`}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                    ) : (
                      <FileIcon className="size-10 text-muted-foreground" />
                    )}
                    <span className="max-w-[150px] truncate text-sm">
                      {fileObj.file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="size-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Public Switch */}
        <div className="flex items-center space-x-2">
          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <Switch
                id="isPublic"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isPublic">Make this rule Public</Label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveDraft} variant="outline">
            Save draft
          </Button>

          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create New Rule</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to create this rule?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isMember
                      ? "Propose"
                      : "Publish"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={isSubmitting}>
            {isMember ? "Propose" : "Publish"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
