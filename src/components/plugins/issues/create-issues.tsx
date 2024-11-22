"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { format, set } from "date-fns";
import { Calendar, FileIcon, Trash2, X } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TooltipLabel from "@/components/globals/forms/tooltip-label";
import { Card } from "@/components/ui/card";
import { Endpoints } from "@/utils/endpoint";
import { useClubStore } from "@/store/clubs-store";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multi-select";
import { IssuesEndpoints } from "@/utils/endpoints/issues";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNodeStore } from "@/store/nodes-store";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const isValidObjectId = (value: string) => objectIdRegex.test(value);

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issueType: z.string().min(1, "Issue type is required"),
  description: z.string().min(1, "Description is required"),
  whereOrWho: z.string().min(1, "Where/Who is required"),
  deadline: z.date(),
  reasonOfDeadline: z.string(),
  significance: z.string().min(1, "Significance is required"),
  whoShouldAddress: z.array(
    z.string().refine(isValidObjectId, "Invalid ObjectId format")
  ),
  isPublic: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
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

type FormValues = z.infer<typeof formSchema>;

export default function CreateIssueForm({
  nodeOrClubId,
  section,
}: {
  nodeOrClubId: string;
  section: TSections;
}) {
  const { currentClub, userJoinedClubs } = useClubStore((state) => state);
  const { currentNode } = useNodeStore((state) => state);
  const [showPublishDialog, setShowPublishDialog] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const imageRef = React.useRef<HTMLInputElement>(null);
  const [issueStatus, setIssueStatus] = React.useState<"draft" | "published">(
    "draft"
  );

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublic: false,
      isAnonymous: false,
    },
  });

  const files = form.watch("files") || [];
  const handleFiles = React.useCallback(
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

      form.setValue("files", [...currentFiles, ...filesWithPreviews], {
        shouldValidate: true,
      });
    },
    [files, form.setValue]
  );

  const handleFileInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
      }
    },
    [handleFiles]
  );

  const removeFile = React.useCallback(
    (index: number) => {
      const currentFiles = files;
      const fileToRemove = currentFiles[index];
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      if (imageRef.current) {
        imageRef.current.value = "";
      }

      const updatedFiles = [...currentFiles];
      updatedFiles.splice(index, 1);
      form.setValue("files", updatedFiles, { shouldValidate: true });
    },
    [files, form.setValue]
  );

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "files") {
          formData.append(key, value.toString());
        }
      });
      values.files?.forEach((fileObj: any) => {
        formData.append("files", fileObj.file);
      });
      formData.append(section, nodeOrClubId);
      formData.append("publishedStatus", issueStatus);

      await IssuesEndpoints.createIssue(formData);

      toast.success("Issue created successfully");
      router.push(`/${section}/${nodeOrClubId}/issues`);
      setUploadedFiles([]);
      setShowPublishDialog(false);
      form.reset();
    } catch (error) {
      console.log(error, "error");
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto  p-6">
      <Card className="p-4">
        <Form {...form}>
          <form className="w-full space-y-6">
            <div className="flex w-full flex-col gap-3  md:flex-row">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <TooltipLabel
                      label="Issue Title"
                      tooltip="Enter a clear, concise title for your issue"
                    />
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueType"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <TooltipLabel
                      label="Issue Type"
                      tooltip="Enter a clear, concise title for your issue type"
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="seeking-strategies">
                          Seeking Strategies
                        </SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="administrative">
                          Administrative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full flex-col gap-3  md:flex-row">
              <FormField
                control={form.control}
                name="whereOrWho"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <TooltipLabel
                      label="Where Who"
                      tooltip="Enter a clear, concise title for your issue"
                    />
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col md:w-1/2">
                    <TooltipLabel
                      label="Deadline"
                      tooltip="Enter a clear, concise title for your issue"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full border-slate-700 pl-3 text-left font-normal text-slate-700 ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full flex-col gap-3  md:flex-row">
              <FormField
                control={form.control}
                name="reasonOfDeadline"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <TooltipLabel
                      label="Reason of deadline"
                      tooltip="Enter a clear, concise title for your issue"
                    />
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="significance"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <TooltipLabel
                      label="Significance"
                      tooltip="Enter a clear, concise title for your issue"
                    />
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="whoShouldAddress"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col md:w-1/2">
                  <TooltipLabel
                    label="Who should address"
                    tooltip="Enter a clear, concise title for your issue"
                  />
                  <FormControl>
                    <MultiSelect
                      options={
                        section === "club"
                          ? currentClub?.members?.map((member: any) => ({
                              title: member?.user?.userName,
                              value: member?.user?._id,
                            })) || []
                          : currentNode?.members?.map((member: any) => ({
                              title: member?.user?.userName,
                              value: member?.user?._id,
                            })) || []
                      }
                      defaultValue={field.value || []}
                      onValueChange={(selectedValues) => {
                        field.onChange(selectedValues);
                      }}
                      placeholder="Select where/who"
                      variant="inverted"
                      // maxCount={serviceTypes.length}
                      maxCount={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <TooltipLabel
                    label="Issue Description"
                    tooltip="Enter a clear, concise title for your issue"
                  />
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <TooltipLabel
                label="Files/Media"
                tooltip="Enter a clear, concise title for your issue"
              />
              <Input
                type="file"
                multiple
                onChange={handleFileInput}
                accept={ACCEPTED_FILE_TYPES.join(",")}
                className="cursor-pointer"
                ref={imageRef}
              />
              <FormDescription>
                Upload images, PDFs, Word documents, or Excel files (max 5MB
                each)
              </FormDescription>

              {/* {uploadedFiles.length > 0 && (
                <div className="grid gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded border p-2"
                    >
                      <span className="max-w-[200px] truncate">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )} */}

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

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Make this Issue public
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Show your name on the issues details page?
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (form.formState.isValid) {
                    setShowPublishDialog(true);
                    setIssueStatus("draft");
                  } else {
                    form.trigger();
                  }
                }}
              >
                Save draft
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (form.formState.isValid) {
                    setShowPublishDialog(true);
                    setIssueStatus("published");
                  } else {
                    form.trigger();
                  }
                }}
              >
                Publish
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish your issue and make it visible according to your
              privacy settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={form.formState.isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
            >
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
