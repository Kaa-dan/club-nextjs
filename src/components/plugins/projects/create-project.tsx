"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useMemo } from "react";
import { useClubStore } from "@/store/clubs-store";
import { useNodeStore } from "@/store/nodes-store";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  X,
  Plus,
  Info,
  CalendarIcon,
  PlusCircle,
  InfoIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ReactQuill from "react-quill-new";
import CropDialog from "@/components/globals/cropper/image-cropper";
import { ProjectApi } from "./projectApi";
import { toast } from "sonner";
import { currencyData } from "@/utils/data/currency";
import { Trash2 } from "lucide-react";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_BANNER_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BANNER_SIZE = 2 * 1024 * 1024; // 2MB

export const projectFormSchema = z
  .object({
    title: z.string().min(1, "Project title is required"),
    region: z.string().min(1, "Project region is required"),
    currency: z.string({
      required_error: "Currency is required",
    }),
    budgetMin: z.string().min(1, "Minimum budget is required"),
    budgetMax: z.string().min(1, "Maximum budget is required"),
    deadline: z.date().optional(),
    significance: z.string().min(1, "Significance is required"),
    solution: z.string().min(1, "Solution is required"),
    relatedEvent: z.string().min(1, "Related event is required"),
    champions: z
      .array(z.string())
      .nonempty("At least one champion is required"),
    committees: z
      .array(
        z.object({
          name: z.string().min(1, "Name is Required"),
          userId: z.string(),
          designation: z.string().min(1, "Designation is required"),
        })
      )
      .nonempty("At least one committee member is required"),
    parameters: z
      .array(
        z.object({
          title: z.string(),
          value: z.string(),
          unit: z.string(),
        })
      )
      .nonempty("At least one parameter is required"),
    faqs: z
      .array(
        z.object({
          question: z.string().min(1, "Question is required"),
          answer: z.string().min(1, "Answer is required"),
        })
      )
      .min(1, "At least one FAQ is required"),
    fundingDetails: z.string().min(1, "Funding details are required"),
    aboutPromoters: z.string().min(1, "About promoters is required"),
    keyTakeaways: z.string().min(1, "Key Takeaway is required"),
    risksAndChallenges: z.string().min(1, "Risks and challenges are required"),
    closingRemark: z.string().min(1, "Closing Remark is required"),
    howToTakePart: z.string().min(1, "How to take part is required"),
    isPublic: z.boolean().default(false),
    files: z
      .array(
        z.object({
          file: z
            .instanceof(File)
            .refine(
              (file) => file.size <= MAX_FILE_SIZE,
              `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            )
            .refine(
              (file) => ACCEPTED_FILE_TYPES.includes(file.type),
              `File type must be one of: ${ACCEPTED_FILE_TYPES.join(", ")}`
            ),
          preview: z.string().optional(),
        })
      )
      .min(1, "At least one file is required"),
    banner: z
      .instanceof(File)
      .refine(
        (file) => file.size <= MAX_BANNER_SIZE,
        `Banner size should be less than ${MAX_BANNER_SIZE / (1024 * 1024)}MB`
      )
      .refine(
        (file) => ACCEPTED_BANNER_TYPES.includes(file.type),
        `Banner must be an image file (${ACCEPTED_BANNER_TYPES.join(", ")})`
      )
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const min = Number(data.budgetMin);
      const max = Number(data.budgetMax);
      return max >= min;
    },
    {
      message: "Maximum budget cannot be less than minimum budget",
      path: ["budgetMax"],
    }
  );
export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectForm({
  forum,
  forumId,
}: {
  forum: TForum;
  forumId: string;
}) {
  const { currentClub } = useClubStore((state) => state);
  const { currentNode } = useNodeStore((state) => state);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const existingFiles = form.getValues("files");

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedFiles = [
          ...existingFiles, // Keep existing files
          {
            file,
            preview: reader.result as string, // Generate a preview
          },
        ];
        form.setValue("files", updatedFiles); // Update the form field
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = form
      .getValues("files")
      .filter((_: any, idx: number) => idx !== index);
    form.setValue("files", updatedFiles);
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      champions: [],
      committees: [
        {
          name: "",
          userId: "",
          designation: "",
        },
      ],
      parameters: [
        {
          title: "",
          unit: "",
          value: "",
        },
      ],
      faqs: [
        {
          question: "",
          answer: "",
        },
      ],
      isPublic: false,
      budgetMin: "0",
      budgetMax: "0",
      relatedEvent: "",
      closingRemark: "",
      files: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "faqs",
    control: form.control,
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const formData = new FormData();

      // Create budget object
      const budget = {
        from: Number(data.budgetMin),
        to: Number(data.budgetMax),
        currency: data.currency,
      };

      // Group committee members - starts with array of individual entries
      const groupedCommittees = data.committees.reduce(
        (acc: any[], member: any) => {
          // Only process if userId exists
          if (!member.userId) return acc;

          const existingIndex = acc.findIndex(
            (m) => m.userId === member.userId
          );

          if (existingIndex !== -1) {
            // If member exists, add new designation to array
            acc[existingIndex].designations.push(member.designation);
          } else {
            // Add new member with designation in array
            acc.push({
              userId: member.userId,
              name: member.name,
              designations: [member.designation],
            });
          }

          return acc;
        },
        []
      );

      // Add all text/number fields except specific excluded ones
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "files" &&
          key !== "banner" &&
          key !== "budgetMin" &&
          key !== "budgetMax" &&
          key !== "committees" && // Exclude the original committees array
          key !== "champions" &&
          value !== undefined
        ) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value?.toString() || "");
          }
        }
      });

      // Add grouped committees
      formData.append("committees", JSON.stringify(groupedCommittees));

      // Add budget as JSON string
      formData.append("budget", JSON.stringify(budget));

      // Add banner if exists
      if (data.banner) {
        formData.append("bannerImage", data.banner);
      }

      formData.append(forum, forumId);

      // Wait for the API call to complete
      await ProjectApi.create(formData);
      toast.success("Project created successfully");

      // Optionally reset form or redirect here
      // form.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
      form.setError("root", { message: "Submission failed" });
    }
  };

  const addParameter = () => {
    const currentParams = form.getValues("parameters");
    form.setValue("parameters", [
      ...currentParams,
      { title: "", value: "", unit: "" },
    ]);
  };
  const [bannerPreview, setBannerPreview] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState(false);

  // Add these handlers inside the component
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerRemove = () => {
    setBannerPreview("");
    form.setValue("banner", null);
  };

  const addCommitteeMember = () => {
    const currentValue = form.getValues("committees") || [];
    form.setValue("committees", [
      ...currentValue,
      {
        userId: "",
        name: "",
        designation: "",
      },
    ]);
  };

  // Get all available members based on forum type
  const allMembers = useMemo(() => {
    return forum === "club"
      ? currentClub?.members?.map((member) => ({
          title: member?.user?.userName,
          value: member?.user?._id,
        })) || []
      : currentNode?.members?.map((member) => ({
          title: member?.user?.userName,
          value: member?.user?._id,
        })) || [];
  }, [forum, currentClub, currentNode]);

  // Since we want to allow duplicates, we can simply return all members
  // without filtering out already selected ones
  const getAvailableOptions = (currentIndex: number) => {
    return allMembers;
  };
  console.log(form.formState.errors.committees);
  return (
    <TooltipProvider>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-4xl space-y-8 p-5 shadow-lg"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex h-6 items-center gap-2">
                    Project Title
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="size-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Enter project title</TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex h-6 items-center gap-2">
                    Project Region
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="size-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Select project region</TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="north">North</SelectItem>
                      <SelectItem value="south">South</SelectItem>
                      <SelectItem value="east">East</SelectItem>
                      <SelectItem value="west">West</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div className="col-span-2 space-y-2">
                <div className="flex h-6 items-center gap-2">
                  <Label>Project Budget Range</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Enter budget range</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min Budget"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max Budget"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex h-6 items-center">
                  <Label>Currency</Label>
                </div>
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencyData?.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.symbol}
                              className="flex items-center"
                            >
                              <span className="font-medium">
                                {currency.code}
                              </span>
                              <span className="ml-2 text-gray-500">
                                - {currency.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex h-6 items-center gap-2">
                    Deadline
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="size-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Select deadline</TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Select date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="significance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Significance
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Enter significance</TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="relatedEvent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Related Event
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="size-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Enter related event</TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Related event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="closingRemark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Closing Remark
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="size-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Enter closing remark</TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Closing remark" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="solution"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Project Solution
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Enter project solution</TooltipContent>
                  </Tooltip>
                </FormLabel>
                <ReactQuill
                  theme="snow"
                  placeholder="Write solution..."
                  {...field}
                  onChange={(content) => field.onChange(content)}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Banner
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Upload banner image</TooltipContent>
                  </Tooltip>
                </FormLabel>
                {!field.value ? (
                  <label className="block cursor-pointer rounded-lg border-2 border-dashed p-8 text-center hover:bg-muted/25">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleBannerChange(e);
                        setModalOpen(true);
                      }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        + Upload banner
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 z-10 bg-background/80 hover:bg-background/90"
                      onClick={handleBannerRemove}
                    >
                      <X className="size-4" />
                    </Button>
                    {field.value && (
                      <Image
                        src={URL.createObjectURL(field.value)}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {bannerPreview && (
            <CropDialog
              aspectRatio={16 / 9}
              imageUrl={bannerPreview}
              open={modalOpen}
              onOpenChange={setModalOpen}
              title="Crop Banner"
              onCrop={(croppedFile) => {
                form.setValue("banner", croppedFile);
                setBannerPreview("");
              }}
            />
          )}

          <FormField
            control={form.control}
            name="champions"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/2">
                <FormLabel className="text-sm font-medium mb-2">
                  Champions
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={
                      forum === "club"
                        ? currentClub?.members?.map((member) => ({
                            title: member?.user?.userName,
                            value: member?.user?._id, // Ensure value is the ID
                          })) || []
                        : currentNode?.members?.map((member) => ({
                            title: member?.user?.userName,
                            value: member?.user?._id, // Ensure value is the ID
                          })) || []
                    }
                    defaultValue={field.value || []} // Set default value to an array
                    onValueChange={(selectedValues) => {
                      field.onChange(selectedValues); // Update field value with IDs
                    }}
                    placeholder="Select champion"
                    variant="inverted"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="committees"
            render={({ field, formState }) => (
              <FormItem>
                <h3 className="mb-4 text-lg font-medium">Project Committee</h3>
                <div className="space-y-6">
                  {field.value.map((member, index) => {
                    const memberError = formState.errors?.committees?.[index];
                    return (
                      <div key={index} className="relative">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Member {index + 1}
                            </FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="size-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Enter member details
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          {index !== 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 text-red-500 hover:bg-transparent hover:text-red-600"
                              onClick={() => {
                                const newValue = [...field.value];
                                newValue.splice(index, 1);
                                field.onChange(newValue);
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {/* Name Field */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-sm font-normal text-gray-600">
                                Name
                              </FormLabel>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="size-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>Select member</TooltipContent>
                              </Tooltip>
                            </div>
                            <FormControl>
                              <MultiSelect
                                options={getAvailableOptions(index)}
                                defaultValue={
                                  member.userId ? member.userId.split(",") : []
                                }
                                onValueChange={(values) => {
                                  const selectedValues = Array.isArray(values)
                                    ? values
                                    : [values];
                                  const newValue = [...field.value];

                                  const selectedMemberNames =
                                    selectedValues.map(
                                      (value) =>
                                        allMembers.find(
                                          (m) => m.value === value
                                        )?.title || ""
                                    );

                                  newValue[index] = {
                                    ...newValue[index],
                                    userId: selectedValues.join(","),
                                    name: selectedMemberNames.join(", "),
                                  };

                                  field.onChange(newValue);
                                }}
                                placeholder="Select members"
                                className="w-full"
                              />
                            </FormControl>
                            {memberError?.name && (
                              <FormMessage>
                                {memberError.name.message}
                              </FormMessage>
                            )}
                          </div>

                          {/* Designation Field */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-sm font-normal text-gray-600">
                                Designation
                              </FormLabel>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="size-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Enter designation
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Input
                              placeholder="Enter designation"
                              value={member.designation}
                              onChange={(e) => {
                                const newValue = [...field.value];
                                newValue[index] = {
                                  ...newValue[index],
                                  designation: e.target.value,
                                };
                                field.onChange(newValue);
                              }}
                            />
                            {memberError?.designation && (
                              <FormMessage>
                                {memberError.designation.message}
                              </FormMessage>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCommitteeMember}
                    className="mt-4"
                  >
                    <PlusCircle className="mr-2 size-4" />
                    Add Member
                  </Button>
                </div>
                {formState.errors?.committees?.message && (
                  <FormMessage>
                    {formState.errors.committees.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parameters"
            render={({ field }) => (
              <FormItem>
                <h3 className="mb-4 text-lg font-medium">
                  Target and Tracking Parameters
                </h3>
                <div className="space-y-6">
                  {field.value.map((param, index) => (
                    <div key={index} className="relative">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Parameter {index + 1}
                          </FormLabel>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="size-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Enter parameter details
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        {index !== 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 text-red-500 hover:bg-transparent hover:text-red-600"
                            onClick={() => {
                              const newValue = [...field.value];
                              newValue.splice(index, 1);
                              field.onChange(newValue);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-sm font-normal text-gray-600">
                              Variable Title
                            </FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="size-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Enter variable title
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            placeholder="Enter title"
                            value={param.title}
                            onChange={(e) => {
                              const newValue = [...field.value];
                              newValue[index] = {
                                ...newValue[index],
                                title: e.target.value,
                              };
                              field.onChange(newValue);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-sm font-normal text-gray-600">
                              Value
                            </FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="size-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>Enter value</TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            placeholder="Enter value"
                            value={param.value}
                            onChange={(e) => {
                              const newValue = [...field.value];
                              newValue[index] = {
                                ...newValue[index],
                                value: e.target.value,
                              };
                              field.onChange(newValue);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-sm font-normal text-gray-600">
                              Unit
                            </FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="size-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>Select unit</TooltipContent>
                            </Tooltip>
                          </div>
                          <Select
                            value={param.unit}
                            onValueChange={(value) => {
                              const newValue = [...field.value];
                              newValue[index] = {
                                ...newValue[index],
                                unit: value,
                              };
                              field.onChange(newValue);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage
                              </SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="currency">Currency</SelectItem>
                              <SelectItem value="time">Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addParameter}
                    className="mt-4"
                  >
                    <PlusCircle className="mr-2 size-4" />
                    Add Parameter
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="howToTakePart"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  How to take part
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Explain participation process
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aboutPromoters"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  About Promoters
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Describe promoters</TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fundingDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Funding Details
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Enter funding details</TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keyTakeaways"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Key Takeaways
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Enter key takeaways</TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="risksAndChallenges"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Risks & Challenges
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Describe risks and challenges
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full bg-white">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 text-sm font-medium">FAQs</div>

              {fields.map((field, index) => (
                <div key={field.id} className="relative mb-6">
                  <div className="relative">
                    <div className="mb-2">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <FormLabel className="text-sm font-normal text-gray-600">
                            Question
                          </FormLabel>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="size-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>Enter question</TooltipContent>
                          </Tooltip>
                        </div>
                        {index !== 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 text-red-500 hover:bg-transparent hover:text-red-600"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                      <FormField
                        control={form.control}
                        name={`faqs.${index}.question`}
                        render={({ field }) => (
                          <FormItem>
                            <Input {...field} placeholder="Add question" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="ml-4 mt-1">
                      <div className="mb-2 flex items-center gap-1">
                        <FormLabel className="text-sm font-normal text-gray-600">
                          Answer
                        </FormLabel>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="size-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>Enter answer</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormField
                        control={form.control}
                        name={`faqs.${index}.answer`}
                        render={({ field }) => (
                          <FormItem>
                            <Input {...field} placeholder="Add answer" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto p-0 font-normal text-green-500 hover:bg-transparent hover:text-green-600"
                  onClick={() => append({ question: "", answer: "" })}
                >
                  <Plus className="mr-1 size-4" />
                  Add FAQ
                </Button>
              </div>
            </div>
          </div>

          {/* <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Files/Media
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Upload files</TooltipContent>
                  </Tooltip>
                </FormLabel>
                <div className="space-y-4">
                  <label className="block cursor-pointer rounded-lg border-2 border-dashed p-8 text-center hover:bg-muted/25">
                    <Input
                      type="file"
                      accept="image/*,.pdf,.xlsx,.xls"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        + Upload files
                      </p>
                    </div>
                  </label>
                  {field.value?.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {field.value.map((file, index) => (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-lg border"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 z-10 size-6 bg-background/80 hover:bg-background/90"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="size-3" />
                          </Button>
                          {file.file.type.startsWith("image/") ? (
                            <img
                              src={file.preview}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-muted/25 p-2 text-center text-sm text-muted-foreground">
                              {file.file.name}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Files/Media
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Upload files</TooltipContent>
                  </Tooltip>
                </FormLabel>
                <div className="space-y-4">
                  <label className="block cursor-pointer rounded-lg border-2 border-dashed p-8 text-center hover:bg-muted/25">
                    <Input
                      type="file"
                      accept="image/*,.pdf,.xlsx,.xls"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        + Upload files
                      </p>
                    </div>
                  </label>
                  {field.value?.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {field.value.map((file, index) => (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-lg border"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 z-10 size-6 bg-background/80 hover:bg-background/90"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="size-3" />
                          </Button>
                          {file.file.type.startsWith("image/") ? (
                            <img
                              src={file.preview}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-muted/25 p-2 text-center text-sm text-muted-foreground">
                              {file.file.name}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>
                    Whether Initiative can be adopted outside the region?
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
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
