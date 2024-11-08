import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addNode } from "../endpoint";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ProgressIndicator from "../progress-bar";
import { Button } from "@/components/ui/button";
import { MODULES } from "@/lib/constants/modules";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Camera, Search, X } from "lucide-react";
import { ICONS, IMGS } from "@/lib/constants";
import { formatName } from "@/utils/text";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const fileSchema = z.z
  .custom<File>()
  .refine((file) => {
    if (!file) return true; // Allow empty for optional files
    return file instanceof File;
  }, "Must be a valid file")
  .refine((file) => {
    if (!file) return true;
    return file.size <= MAX_FILE_SIZE;
  }, `File size should be less than 2MB`)
  .refine((file) => {
    if (!file) return true;
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, "Only .jpg, .jpeg, and .png formats are supported");

// Validation schema using Zod
const formSchema = z.object({
  profilePhoto: z
    .union([
      z.any(), // For existing image URLs
      fileSchema,
      z.undefined(),
    ])
    .optional(),
  coverPhoto: z
    .union([
      z.any(), // For existing image URLs
      fileSchema,
      z.undefined(),
    ])
    .optional(),
  name: z
    .string()
    .min(1, { message: "Node name is required" })
    .refine((value) => value.trim().length > 0, {
      message: "Node name cannot be empty ",
    }),

  about: z
    .string()
    .min(1, { message: "About is required" })
    .refine((value) => value.trim().length > 0, {
      message: "About cannot be empty ",
    }),

  location: z
    .string()
    .min(1, { message: "Location is required" })
    .refine((value) => value.trim().length > 0, {
      message: "Location cannot be empty ",
    }),

  description: z
    .string()
    .min(1, { message: "Description is required" }) // Ensure description is also required
    .refine((value) => value.trim().length > 0, {
      message: "Description cannot be empty ",
    }), // Trim check
});

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DetailsForm = ({
  onSubmit,
  form,
}: {
  onSubmit: (values: {
    profilePhoto?: File | null;
    coverPhoto?: File | null;
    name: string;
    about: string;
    location: string;
    description: string;
  }) => void;
  form: UseFormReturn<
    {
      profilePhoto?: File | null;
      coverPhoto?: File | null;
      name: string;
      about: string;
      location: string;
      description: string;
    },
    any,
    undefined
  >;
}) => {
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    form.getValues().coverPhoto
      ? URL.createObjectURL(form.getValues().coverPhoto as File)
      : null
  );
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(
    form.getValues().profilePhoto
      ? URL.createObjectURL(form.getValues().profilePhoto as File)
      : null
  );

  console.log("errors", form.formState.errors);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 overflow-y-auto px-4 md:max-h-[60vh]"
      >
        {/* Profile Photo */}
        <FormField
          control={form.control}
          name="profilePhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center gap-4">
                  <div className="group relative">
                    <div className="relative size-24">
                      {profilePreviewUrl ? (
                        <img
                          src={profilePreviewUrl}
                          alt="Profile preview"
                          className="size-24 rounded-md border-2 border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex size-24 items-center justify-center rounded-md border-2 border-gray-200 bg-gray-100">
                          <Camera className="size-8 text-gray-400" />
                        </div>
                      )}
                      <label
                        htmlFor="profilePhotoInput"
                        className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-30"
                      >
                        <div className="flex flex-col items-center text-white opacity-0 group-hover:opacity-100">
                          <Camera className="size-6" />
                          <span className="text-xs">Upload</span>
                        </div>
                      </label>
                    </div>
                    <input
                      id="profilePhotoInput"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setProfilePreviewUrl(url);
                          field.onChange(file);
                        }
                      }}
                    />
                  </div>
                  {profilePreviewUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      className="text-sm text-red-500 hover:text-red-600"
                      onClick={() => {
                        setProfilePreviewUrl(null);
                        field.onChange("");
                      }}
                    >
                      Remove photo
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Photo */}
        <FormField
          control={form.control}
          name="coverPhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Cover Photo
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <label
                    htmlFor="coverPhotoInput"
                    className="group block h-48 w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 transition-colors duration-200 hover:border-gray-400"
                  >
                    {coverPreviewUrl ? (
                      <img
                        src={coverPreviewUrl}
                        alt="Cover preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center space-y-2">
                        <Camera className="size-8 text-gray-400 group-hover:text-gray-500" />
                        <span className="text-sm text-gray-500 group-hover:text-gray-600">
                          Click to upload cover photo
                        </span>
                      </div>
                    )}
                  </label>
                  <input
                    id="coverPhotoInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        form.setValue("coverPhoto", file);
                        setCoverPreviewUrl(url);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Node Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter node name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* About */}
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea placeholder="Write text..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select location</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Location1">Location 1</SelectItem>
                    <SelectItem value="Location2">Location 2</SelectItem>
                    <SelectItem value="Location3">Location 3</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write text..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <div className="ml-auto flex w-1/4 gap-2">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          className="w-full rounded-lg py-2 text-white"
        >
          Next
        </Button>
      </div>
    </Form>
  );
};

const AddNodeDialog = ({ open, setOpen }: IProps) => {
  const [currentStep, setCurrentStep] = useState<
    "Details" | "Modules" | "Success"
  >("Details");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profilePhoto: null,
      coverPhoto: null,
      name: "",
      about: "",
      location: "",
      description: "",
    },
  });
  const onSubmitDetails = () => {
    setCurrentStep("Modules");
  };
  const onFinalSubmit = async () => {
    const formData = new FormData();
    const values = form.getValues();
    console.log(values, "vall");

    if (values.profilePhoto)
      formData.append("profileImage", values.profilePhoto);

    if (values.coverPhoto) formData.append("coverImage", values.coverPhoto);
    formData.append("name", formatName(values.name));
    formData.append("about", values.about);
    formData.append("location", values.location);
    formData.append("description", values.description);
    console.log("values", values);
    try {
      const response = await addNode(formData);
      toast.success(response.message);
      setCurrentStep("Success");
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.message || error.response.data.message || "something went wrong"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {currentStep === "Success" ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Image
              alt="tick"
              src={ICONS.GreenTickIcon}
              height={60}
              width={60}
              className="h-40 w-[25rem] object-cover object-top"
            />
            <span className=" font-semibold">Created Successfully🥳</span>
            <span className="text-center text-slate-400">
              {
                "Creating a code of conduct for a social media group is essential to maintain a positive and respectful online "
              }
            </span>
            <Button variant={"outline"} className="border-black text-black">
              View node
            </Button>
          </div>
        ) : (
          <>
            <DialogTitle>Create a node</DialogTitle>
            <div className="w-full border"></div>

            <div className="mx-auto w-fit">
              <ProgressIndicator
                smallText={true}
                steps={["Details", "Modules"]}
                currentStep={currentStep}
              />
            </div>
            {currentStep === "Details" ? (
              <DetailsForm form={form} onSubmit={onSubmitDetails} />
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-sm bg-slate-100 px-2">
                  <Search className="text-slate-600" />
                  <Input
                    placeholder="Enter name"
                    className="h-8 w-full border-none bg-slate-100"
                  />
                </div>
                <div className="flex flex-col gap-2  overflow-y-auto px-4 md:max-h-[60vh]">
                  {MODULES.map((module) => {
                    const moduleSelected = selectedModules.includes(
                      module.name
                    );
                    return (
                      <div className="w-full" key={module.name}>
                        <div className="w-full border "></div>
                        <div className="flex items-center gap-4 py-2">
                          <Card className="rounded-md p-2">
                            <Image
                              src={module.icon}
                              alt={module.name}
                              width={15}
                              height={15}
                            />
                          </Card>
                          <span className="font-medium">{module.name}</span>
                          <Button
                            onClick={() => {
                              if (moduleSelected) {
                                setSelectedModules((prev) =>
                                  prev.filter((m) => m !== module.name)
                                );
                              } else {
                                setSelectedModules((prev) => [
                                  ...prev,
                                  module.name,
                                ]);
                              }
                            }}
                            variant={"outline"}
                            className="ml-auto border-slate-500 text-black"
                          >
                            {moduleSelected ? (
                              <span className="text-slate-500">Added</span>
                            ) : (
                              <span className="text-black">Add</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="mb-4 w-full border"></div>

                  <div className="ml-auto flex w-1/2 gap-2">
                    <Button
                      onClick={() => setCurrentStep("Details")}
                      variant={"outline"}
                      className="w-full rounded-lg border-black py-2 text-black"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={selectedModules.length === 0}
                      onClick={onFinalSubmit}
                      className="w-full rounded-lg py-2 text-white"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddNodeDialog;
