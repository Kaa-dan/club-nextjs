"use client";

import React, { useCallback, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useForm, Controller, Form } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { Info, Upload, X, FileIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Endpoints } from "@/utils/endpoint";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

// Types
// interface FileWithPreview {
//   file: File;
//   preview?: string;
// }

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 5;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

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
    .refine(
      (val) => {
        return val !== "<p><br></p>" && val.trim() !== "";
      },
      {
        message: "Description cannot be empty.",
      }
    ),

  isPublic: z.boolean(),
  files: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            `File size should be less than 5MB`
          )
          .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type as any),
            `File type must be one of: ${ACCEPTED_FILE_TYPES.join(", ")}`
          ),
        preview: z.string().optional(),
      })
    )
    .max(MAX_FILES, `You can only upload up to ${MAX_FILES} files`)
    .optional()
    .default([]),
});

type FormData = z.infer<typeof formSchema>;

export default function RuleForm({
  nodeOrClubId,
  section,
}: {
  nodeOrClubId: string;
  section: TSections;
}) {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
    reset,
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
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const router = useRouter();
  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const currentFiles = files;
      if (currentFiles.length + newFiles.length > MAX_FILES) {
        toast.warning(`You can only upload a maximum of ${MAX_FILES} files.`);
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
      const currentFiles = files;
      const fileToRemove = currentFiles[index];
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const updatedFiles = [...currentFiles];
      updatedFiles.splice(index, 1);
      setValue("files", updatedFiles, { shouldValidate: true });
    },
    [files, setValue]
  );

  const [inputValue, setInputValue] = useState("");
  const tags = watch("tags");

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

      data.files?.forEach((fileObj: any) => {
        formDataToSend.append("file", fileObj.file);
      });

      formDataToSend.append(section, nodeOrClubId);

      const response = await Endpoints.addRulesAndRegulations(formDataToSend);
      toast.success(response.message || "Rules successfully created");

      // Clean up previews before reset
      data.files?.forEach((fileObj) => {
        if (fileObj.preview) {
          URL.revokeObjectURL(fileObj.preview);
        }
      });
      setIsAlertOpen(false);
      router.push(`/${section}/${nodeOrClubId}/rules`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit rule. Please try again.");
    } finally {
      reset();
    }
  };
  return (
    <Card className="min-w-[100%] max-w-3xl p-6">
      <form
        onSubmit={handleSubmit(() => setIsAlertOpen(true))}
        className="space-y-4"
      >
        {/* Title and Domain */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    Title <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white">Add title for your rule</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} id="title" placeholder="Enter rule" />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors?.title?.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    Domain <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white">Add a domain for your rule</p>
                </TooltipContent>
              </Tooltip>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    Category <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white">Add category for your rule</p>
                </TooltipContent>
              </Tooltip>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    Applicable for?{" "}
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white">Applicable for?</p>
                </TooltipContent>
              </Tooltip>
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
            <Label htmlFor="significance" className="flex items-center gap-2">
              Significance <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
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
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      Tags <Info className="h-4 w-4 text-muted-foreground" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-white">Enter Tags for your rule</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex flex-wrap items-center gap-1 p-1 bg-background border border-input rounded-md  min-h-[40px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-300 text-secondary-foreground px-1.5 py-0.5 rounded text-xs flex items-center"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag}</span>
                    </Button>
                  </span>
                ))}
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      id="tags"
                      placeholder="Enter Tags"
                      className="flex-1 border-0 h-6 text-sm px-1"
                    />
                  )}
                />
              </div>
            </div>
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>
        </div>

        {/* Rule Description */}
        {/* <TooltipLabel
              label="Description"
              tooltip="Enter"
        /> */}
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2"
                >
                  Description <Info className="h-4 w-4 text-muted-foreground" />
                </Label>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-white">
                  Enter a detailed description of your project or task
                </p>
              </TooltipContent>
            </Tooltip>
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
                  <p className="text-sm text-red-500 mt-2">
                    {errors.description.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="flex items-center gap-2">
            Files/Media <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground ml-2">
              (JPEG, PNG, PDF, DOCX, Excel)
            </span>
          </Label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-lg p-6 text-center"
          >
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              accept={ACCEPTED_FILE_TYPES.join(",")}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                + Drag or Upload files (max 5 files, 5 MB each)
              </span>
            </label>
          </div>
          {errors.files && (
            <p className="text-sm text-red-500">{errors.files.message}</p>
          )}
          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {files.map((fileObj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    {fileObj.file.type.startsWith("image/") &&
                    fileObj.preview ? (
                      <Image
                        src={fileObj.preview}
                        alt={`Preview of ${fileObj.file.name}`}
                        width={40}
                        height={40}
                        className="object-cover rounded"
                      />
                    ) : (
                      <FileIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                    <span className="text-sm truncate max-w-[150px]">
                      {fileObj.file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
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
          <Label htmlFor="isPublic">Make this rule public</Label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
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

              formDataToSend.append(section, nodeOrClubId);
              formDataToSend.append("publishedStatus", "draft");
              Endpoints.addRulesAndRegulations(formDataToSend).then((res) => {
                if (res.isActive) {
                  toast.success("saved to draft successfully");
                }
              });
            }}
            variant="outline"
          >
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
                  {isSubmitting ? "Submitting..." : "Publish"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={isSubmitting}>
            publish
          </Button>
        </div>
      </form>
    </Card>
  );
}
