"use client";

import React, { useCallback, useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useForm, Controller } from "react-hook-form";
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
import { Info, Upload, X, FileIcon, XCircle } from "lucide-react";
import Image from "next/image";
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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import {
  BreadcrumbItemType,
  CustomBreadcrumb,
} from "@/components/globals/breadcrumb-component";
import { Endpoints } from "@/utils/endpoint";
import { toast } from "sonner";

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
  file: z
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
  files: z.unknown().optional(), // Exclude validation for 'files'
});

type FormData = z.infer<typeof formSchema>;

export default function EditRuleForm({
  nodeOrClubId,
  forum,
  postId,
}: {
  nodeOrClubId: string;
  forum: string;
  postId: string;
}) {
  const breadcrumbItems: BreadcrumbItemType[] = [
    {
      label: "Rules",
      href: `/${forum}/${nodeOrClubId}/issues`,
    },
    {
      label: "Create",
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    getValues,
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
      file: [],
      files: [],
    },
  });
  const [rule, setRule] = useState<any>();
  useEffect(() => {
    Endpoints.specificRule(postId).then((response) => {
      const data = response;
      setRule(data);
      setValue("title", data?.title || "");
      setValue("domain", data?.domain || "");
      setValue("category", data?.category || "");
      setValue("applicableFor", data?.applicableFor || "");
      setValue("significance", data.significance || "");
      setValue("tags", data.tags || []);
      setValue("description", data.description || "");
      setValue("isPublic", data.isPublic || false);
      setValue("files", data.files || []);
    });
  }, [postId, setValue]);

  const newFiles = watch("file") || [];
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const router = useRouter();

  // Handle file addition (new files)
  const handleFiles = useCallback(
    (filesToAdd: File[]) => {
      const currentFiles = newFiles; // Get current files from form state
      if (currentFiles.length + filesToAdd.length > MAX_FILES) {
        alert(`You can only upload a maximum of ${MAX_FILES} files.`);
        return;
      }

      const filesWithPreviews = filesToAdd?.map((file) => ({
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      // Update form state with the new files (both current and new ones)
      setValue("file", [...currentFiles, ...filesWithPreviews], {
        shouldValidate: true,
      });
    },
    [newFiles, setValue]
  );

  // Handle file drop event
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  // Handle file input event (e.g., when selecting files via file picker)
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
      }
    },
    [handleFiles]
  );

  // Handle removing a file
  const removeFile = useCallback(
    (index: number) => {
      const currentFiles = newFiles; // Get current files from form state
      const fileToRemove = currentFiles[index];
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const updatedFiles = [...currentFiles];
      updatedFiles.splice(index, 1);
      setValue("file", updatedFiles, { shouldValidate: true });
    },
    [newFiles, setValue]
  );

  const watchedFiles: any = watch("files");

  const handleRemoveFile = (id: string) => {
    const updatedFiles = watchedFiles.filter(
      (fileObj: any) => fileObj._id !== id
    );
    setValue("files", updatedFiles); // Update the form state with the filtered files
  };
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

  const onSubmit = async (data: FormData | any) => {
    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("title", data.title);
      formDataToSend.append("domain", data.domain);
      formDataToSend.append("category", data.category);
      formDataToSend.append("applicableFor", data.applicableFor);
      formDataToSend.append("significance", data.significance);
      formDataToSend.append("description", data.description);
      formDataToSend.append("isPublic", String(data.isPublic));
      formDataToSend.append("sample", "hello");
      // Add tags as JSON string
      formDataToSend.append("tags", JSON.stringify(data.tags));

      // Add new files
      if (data?.file && data?.file?.length > 0) {
        data?.file.forEach((fileObj: any) => {
          formDataToSend.append("file", fileObj.file);
        });
      }

      // // Add existing files
      if (data?.files && data?.files?.length > 0) {
        formDataToSend.append("files", JSON.stringify(data.files));
      }

      // Add forum identifier
      formDataToSend.append("_id", postId);

      const response = await Endpoints.updateRule(formDataToSend);
      toast.success(response.message || "Rules successfully updated");

      // Clean up previews
      data?.file?.forEach((fileObj: any) => {
        if (fileObj?.preview) {
          URL.revokeObjectURL(fileObj?.preview);
        }
      });

      setIsAlertOpen(false);
      router.push(`/${forum}/${nodeOrClubId}/rules`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update rule. Please try again.");
    }
  };
  const files: any = getValues("files");

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} className="my-4" />
      <Card className="min-w-full max-w-3xl p-6">
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
                      Title <Info className="size-4 text-muted-foreground" />
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
                      Domain <Info className="size-4 text-muted-foreground" />
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
                      Category <Info className="size-4 text-muted-foreground" />
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
                  <Input
                    {...field}
                    id="category"
                    placeholder="Enter Category"
                  />
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
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
                      <Info className="size-4 text-muted-foreground" />
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
                Significance <Info className="size-4 text-muted-foreground" />
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
                        Tags <Info className="size-4 text-muted-foreground" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-white">Enter Tags for your rule</p>
                    </TooltipContent>
                  </Tooltip>
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
                        className="h-6 flex-1 border-0 px-1 text-sm"
                      />
                    )}
                  />
                </div>
              </div>
              {errors.tags && (
                <p className="text-sm text-destructive">
                  {errors.tags.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    Description{" "}
                    <Info className="size-4 text-muted-foreground" />
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
            <Label htmlFor="file-upload" className="flex items-center gap-2">
              Files/Media <Info className="size-4 text-muted-foreground" />
              <span className="ml-2 text-xs text-muted-foreground">
                (JPEG, PNG, PDF, DOCX, Excel)
              </span>
            </Label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-lg border-2 border-dashed p-6 text-center"
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
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <Upload className="size-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  + Drag or Upload files (max 5 files, 5 MB each)
                </span>
              </label>
            </div>
            {errors.files && (
              <p className="text-sm text-red-500">{errors.files.message}</p>
            )}
            {files.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {files
                  .filter((fileObj: any) => fileObj?.url?.startsWith("http"))
                  .map((fileObj: any) => (
                    <div
                      key={fileObj._id} // Use _id for unique key
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Image
                          src={fileObj.url} // Use the file URL for the image preview
                          alt={`Preview of ${fileObj.originalname}`}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                        <span className="max-w-[150px] truncate text-sm">
                          {fileObj.originalname}{" "}
                          {/* Display the original file name */}
                        </span>
                      </div>
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(fileObj._id)} // Remove the file on click
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle className="size-5" /> {/* Lucid Cross icon */}
                      </button>
                    </div>
                  ))}
              </div>
            )}
            {newFiles?.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {newFiles.map((fileObj, index) => (
                  <div
                    key={index} // Use index or another unique identifier
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="flex items-center space-x-2">
                      {/* Check if the file is an image and display the preview */}
                      {fileObj.file.type.startsWith("image/") &&
                      fileObj.preview ? (
                        <Image
                          src={fileObj.preview} // Show image preview
                          alt={`Preview of ${fileObj.file.name}`}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      ) : (
                        <FileIcon className="size-10 text-muted-foreground" /> // Default file icon
                      )}
                      <span className="max-w-[150px] truncate text-sm">
                        {fileObj.file.name} {/* Display file name */}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)} // Function to remove the file
                    >
                      <X className="size-4" /> {/* Remove icon */}
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
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            {rule?.publishedStatus == "draft" ? (
              <Button
                type="button"
                onClick={() => {
                  console.log("Saved as draft");
                  alert("Draft saved successfully");
                }}
                variant="outline"
              >
                Save draft
              </Button>
            ) : (
              ""
            )}

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Rule Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to update this rule. Please review your
                    changes carefully before proceeding.
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
                    {isSubmitting ? "Updating..." : "Update Rule"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={isSubmitting}>
              {(rule?.publishedStatus == "true" && "save the changes") ||
                "Publish"}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
