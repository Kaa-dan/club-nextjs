"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Calendar, Trash2, X } from "lucide-react";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
  deadline: z.date().optional(),
  reasonOfDeadline: z.string().optional(),
  significance: z.string().min(1, "Significance is required"),
  whoShouldAddress: z
    .array(z.string().refine(isValidObjectId, "Invalid ObjectId format"))
    .optional(),
  isPublic: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
  files: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().max(MAX_FILE_SIZE, "File size must be less than 5MB"),
        type: z
          .string()
          .refine(
            (type) => ACCEPTED_FILE_TYPES.includes(type),
            "Invalid file type"
          ),
        url: z.string(),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateIssueForm({
  nodeOrClubId,
  section,
}: {
  nodeOrClubId: string;
  section: TSections;
}) {
  const { selectedClub } = useClubStore((state) => state);
  const [showPublishDialog, setShowPublishDialog] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublic: false,
      isAnonymous: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);

    // Create file objects for form
    const fileObjects = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    const currentFiles = form.getValues("files") || [];
    form.setValue("files", [...currentFiles, ...fileObjects]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);

    const formFiles = form.getValues("files") || [];
    formFiles.splice(index, 1);
    form.setValue("files", formFiles);
  };

  const onSubmit = async (values: FormValues) => {
    form.reset();
    setUploadedFiles([]);
  };

  // function fetchClubMembers() {
  //   Endpoints.fetchClubMembers(nodeOrClubId as string)
  //     .then((res) => {
  //     })
  //     .catch((err) => {
  //       console.log({ err });
  //     });
  // }

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
                      <Controller
                        control={form.control}
                        name="whereOrWho"
                        render={({ field }) => (
                          <MultiSelect
                            selectedValues={field.value ?? []}
                            onValueChange={field.onChange}
                          />
                        )}
                      />
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
                            className={`w-full pl-3 text-left font-normal ${
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
                <FormItem>
                  <TooltipLabel
                    label="Who should address"
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
                onChange={handleFileChange}
                accept={ACCEPTED_FILE_TYPES.join(",")}
                className="cursor-pointer"
              />
              <FormDescription>
                Upload images, PDFs, Word documents, or Excel files (max 5MB
                each)
              </FormDescription>

              {uploadedFiles.length > 0 && (
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
                    form.handleSubmit(onSubmit)();
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.handleSubmit(onSubmit)();
                setShowPublishDialog(false);
              }}
            >
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface Member {
  value: string;
  label: string;
}

interface MultiSelectProps {
  selectedValues?: string[];
  onValueChange?: (value: string[]) => void;
}

interface WhereWhoFieldProps {
  form: UseFormReturn<any>;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  selectedValues = [],
  onValueChange,
}) => {
  const [selected, setSelected] = React.useState<Member[]>([]);

  const members: Member[] = [
    {
      value: "67208f7ab74aaf0060577078",
      label: "Upton Valentine",
    },
    {
      value: "67212bcc97aca190e60445ed",
      label: "Carly Rodriguez",
    },
    {
      value: "672b3d000a662305934ddc84",
      label: "Phyllis Rivas",
    },
  ];

  const selectMember = (member: Member): void => {
    const newSelected = [...selected, member];
    setSelected(newSelected);
    onValueChange?.(newSelected?.map((item) => item?.value) ?? []);
  };

  const removeMember = (memberToRemove: Member): void => {
    const newSelected =
      selected?.filter((member) => member?.value !== memberToRemove?.value) ??
      [];
    setSelected(newSelected);
    onValueChange?.(newSelected?.map((item) => item?.value) ?? []);
  };

  return (
    <Command className="relative rounded-lg border">
      <div className="flex flex-wrap gap-1 p-1">
        {selected?.map((member) => (
          <Badge
            key={member?.value}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {member?.label}
            <button
              type="button"
              className="rounded-full outline-none"
              onClick={() => removeMember(member)}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <CommandInput
          placeholder="Search members..."
          className="border-0 outline-none focus:ring-0"
        />
      </div>
      <div className="absolute top-full z-10 w-full rounded-b-lg border-x border-b bg-white">
        <CommandEmpty>No members found.</CommandEmpty>
        <CommandGroup>
          {members
            ?.filter(
              (member) => !selected?.find((s) => s?.value === member?.value)
            )
            ?.map((member) => (
              <CommandItem
                key={member?.value}
                value={member?.label}
                onSelect={() => selectMember(member)}
                className="cursor-pointer"
              >
                {member?.label}
              </CommandItem>
            ))}
        </CommandGroup>
      </div>
    </Command>
  );
};
