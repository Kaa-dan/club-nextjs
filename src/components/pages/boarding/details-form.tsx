"use client";
import { format } from "date-fns";

import React, { useState, useEffect, use } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { postDetails } from "./endpoint";
import { useTokenStore } from "@/store/store";
import { formatName } from "@/lib/utils";
import { toast } from "sonner";

type Step = "details" | "image" | "interest" | "node";

//form validation using zed

const stepOneSchema = z.object({
  userName: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .regex(/^[^\s].*[^\s]$/, {
      message: "First name cannot start or end with a space.",
    }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .regex(/^[^\s].*[^\s]$/, {
      message: "Last name cannot start or end with a space.",
    }),

  phoneNumber: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be a valid number",
  }),

  dateOfBirth: z.string().nonempty({ message: "Birthdate is required." }),
  gender: z.string().nonempty({ message: "Gender is required." }),
  terms: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions",
  }),
});
type StepOneType = z.infer<typeof stepOneSchema>;

interface DetailsFormProps {
  setStep: (step: Step) => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ setStep }) => {
  //global store
  const { globalUser, setGlobalUser } = useTokenStore((state) => state);

  //for storign for values
  const [formData, setFormData] = useState<Partial<StepOneType>>({});
  const [initialValues, setInitialValues] = useState<StepOneType | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  //form instance with validation
  const form = useForm<StepOneType>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      userName: globalUser?.userName || "",
      firstName: globalUser?.firstName || "",
      lastName: globalUser?.lastName || "",
      phoneNumber: globalUser?.phoneNumber || "",
      dateOfBirth: globalUser?.dateOfBirth
        ? new Date(globalUser?.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: globalUser?.gender || "",
      terms: globalUser?.gender ? true : false,
    },
  });

  // Set initial values for comparison
  useEffect(() => {
    setInitialValues(form.getValues());
  }, [form]);

  // Watch all form values and detect changes
  const watchedValues = form.watch();

  useEffect(() => {
    // Check if current values are different from initial values
    // and also check if the values are not empty
    if (
      initialValues &&
      Object.entries(initialValues).some(
        ([key, val]) => key !== "terms" && val === ""
      )
    ) {
      setIsChanged(true);
      return;
    }

    if (
      initialValues &&
      JSON.stringify(initialValues) !== JSON.stringify(watchedValues)
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [watchedValues, initialValues]);

  // submit handler
  const onSubmit: SubmitHandler<StepOneType> = async (data) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    console.log({ newFormData });
    if (globalUser) {
      try {
        const response = await postDetails(globalUser._id, newFormData);
        console.log({ response });
        setGlobalUser(response?.data);
        setStep("image");
      } catch (error: any) {
        console.log(error?.response?.data);
        toast.error(error?.response?.data?.message || "something went wrong");
        if (
          error?.response?.data?.message &&
          error?.response?.data?.message.includes("userName")
        ) {
          form.setError("userName", {
            type: "manual",
            message: "Username is already taken", // Custom error message
          });
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter username"
                    {...field}
                    onChange={(e) => {
                      const value = e.target?.value?.toLowerCase();
                      const formattedName = formatName(value, {
                        makeFirstLetterUppercase: false,
                        allowUppercaseInBetween: false,
                        allowNumbers: true,
                      });
                      field.onChange(formattedName?.toLowerCase());
                      form.setValue("userName", formattedName?.toLowerCase());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter first name"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("firstName", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter last name"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("lastName", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthdate</FormLabel>
                <FormControl>
                  {/* <Input type="date" {...field} /> */}
                  <Input
                    type="date"
                    min={format(
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 100)
                      ),
                      "yyyy-MM-dd"
                    )} // Allow dates as far back as 100 years
                    max={format(
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 12)
                      ).setMonth(11, 31),
                      "yyyy-MM-dd"
                    )} // Set max to Dec 31, 2018
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNumbers: true,
                      });

                      if (formattedName.length > 10) {
                        return;
                      }
                      console.log(formattedName.length);
                      field.onChange(formattedName);
                      form.setValue("phoneNumber", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <div className="my-4 flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>
                  I agree to the{" "}
                  <Link href="#" className="text-primary">
                    Terms of Services
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary">
                    Privacy Policy
                  </Link>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          {/* <Button variant="outline" type="button">
            Back
          </Button> */}
          {isChanged ? (
            <Button
              type="submit"
              className="text-white"
              disabled={form?.formState?.isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button
              className="text-white"
              onClick={(e) => {
                e.preventDefault();
                setStep("image");
              }}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default DetailsForm;
