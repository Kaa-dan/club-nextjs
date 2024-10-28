import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Search, X } from "lucide-react";
import { ICONS, IMGS } from "@/lib/constants";

// Validation schema using Zod
const formSchema = z.object({
  profilePhoto: z.string().optional(),
  name: z.string().min(1, { message: "Node name is required" }),
  about: z.string().min(1, { message: "About is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  description: z.string().optional(),
});

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DetailsForm = ({
  form,
  onSubmit,
}: {
  form: UseFormReturn<
    {
      profilePhoto: string;
      name: string;
      about: string;
      location: string;
      description: string;
    },
    any,
    undefined
  >;
  onSubmit: (values: {
    profilePhoto: string;
    name: string;
    about: string;
    location: string;
    description: string;
  }) => void;
}) => {
  console.log("errors", form.formState.errors);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 md:max-h-[60vh] px-4 overflow-y-auto"
      >
        {/* Profile Photo */}
        <FormField
          control={form.control}
          name="profilePhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select profile photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        // setPreviewUrl(reader.result);
                        field.onChange(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </FormControl>
              {/* {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              )} */}
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
      <div className="flex gap-2 w-1/4 ml-auto">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          className="w-full text-white py-2 rounded-lg"
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profilePhoto: "",
      name: "",
      about: "",
      location: "",
      description: "",
    },
  });

  const onSubmit = (values: any) => {
    console.log(values);
    setCurrentStep("Modules");
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
              className="object-cover object-top h-[10rem] w-[25rem]"
            />
            <span className=" font-semibold">Created Successfully🥳</span>
            <span className="text-slate-400 text-center">
              {
                "Creating a code of conduct for a social media group is essential to maintain a positive and respectful online "
              }
            </span>
            <Button variant={"outline"} className="text-black border-black">
              View node
            </Button>
          </div>
        ) : (
          <>
            <DialogTitle>Create a node</DialogTitle>
            <div className="w-full border"></div>

            <div className="w-fit mx-auto">
              <ProgressIndicator
                smallText={true}
                steps={["Details", "Modules"]}
                currentStep={currentStep}
              />
            </div>
            {currentStep === "Details" ? (
              <DetailsForm form={form} onSubmit={onSubmit} />
            ) : (
              <>
                <div className="flex items-center gap-2 bg-slate-100 rounded-sm px-2">
                  <Search className="text-slate-600" />
                  <Input
                    placeholder="Enter name"
                    className="w-full h-8 bg-slate-100 border-none"
                  />
                </div>
                <div className="flex flex-col gap-2  md:max-h-[60vh] px-4 overflow-y-auto">
                  {MODULES.map((module) => {
                    const moduleSelected = selectedModules.includes(
                      module.name
                    );
                    return (
                      <div className="w-full" key={module.name}>
                        <div className="w-full border "></div>
                        <div className="flex items-center gap-4 py-2">
                          <Card className="p-2 rounded-md">
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
                            className="text-black border-slate-500 ml-auto"
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
                  <div className="w-full border mb-4"></div>

                  <div className="flex gap-2 w-1/2 ml-auto">
                    <Button
                      onClick={() => setCurrentStep("Details")}
                      variant={"outline"}
                      className="w-full text-black border-black py-2 rounded-lg"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={selectedModules.length === 0}
                      onClick={
                        // form.handleSubmit(onSubmit)
                        () => setCurrentStep("Success")
                      }
                      className="w-full text-white py-2 rounded-lg"
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
