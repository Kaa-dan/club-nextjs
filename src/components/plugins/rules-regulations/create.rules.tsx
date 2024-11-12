"use client";

import React, { useCallback, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Info, Upload, X, FileIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Endpoints } from "@/utils/endpoint";

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
  tags: z.string(),
  description: z.string().min(1, "Rule description is required"),
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

export default function RuleForm({ clubId }: { clubId: string }) {
  const {
    control,
    handleSubmit,
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
      tags: "",
      description: "",
      isPublic: false,
      files: [],
    },
  });

  const files = watch("files") || [];
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

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

  // Form submission
  const onSubmit = async (data: FormData) => {
    try {
      const formDataToSend = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "files") {
          formDataToSend.append(key, value.toString());
        }
      });

      data.files?.forEach((fileObj) => {
        formDataToSend.append("file", fileObj.file);
      });
      formDataToSend.append("club", clubId);

      const response = await Endpoints.addRulesAndRegulations(formDataToSend);
      toast.success(response.message || "Rules successfully created");
      // Clean up previews before reset
      data.files?.forEach((fileObj) => {
        if (fileObj.preview) {
          URL.revokeObjectURL(fileObj.preview);
        }
      });
      setIsAlertOpen(false);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit rule. Please try again.");
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
            <Label htmlFor="ruleTitle" className="flex items-center gap-2">
              Rule Title <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
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
            <Label htmlFor="domain" className="flex items-center gap-2">
              Domain <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
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
            <Label htmlFor="category" className="flex items-center gap-2">
              Category <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
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
            <Label htmlFor="applicableFor" className="flex items-center gap-2">
              Applicable for? <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
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
            <Label htmlFor="tags" className="flex items-center gap-2">
              Tags <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Input {...field} id="tags" placeholder="Enter Tags" />
              )}
            />
            {errors.tags && (
              <p className="text-sm text-red-500">{errors.tags.message}</p>
            )}
          </div>
        </div>

        {/* Rule Description */}
        <div className="space-y-2">
          <Label htmlFor="ruleDescription">Rule Description</Label>
          <Card className="p-1">
            <div className="border-b p-2 flex gap-2">
              <Button type="button" variant="ghost" size="sm">
                B
              </Button>
              <Button type="button" variant="ghost" size="sm">
                I
              </Button>
              <Button type="button" variant="ghost" size="sm">
                •
              </Button>
            </div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Write here..."
                  className="border-0 focus-visible:ring-0 min-h-[100px]"
                />
              )}
            />
          </Card>
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
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
          <Button type="button" variant="outline">
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
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
