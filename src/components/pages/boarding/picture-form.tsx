"use client";

import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import PhotoInput from "@/components/ui/photo-input";
import Link from "next/link";
import { postPicture } from "./endpoint";
import { useTokenStore } from "@/store/store";

type Step = "details" | "image" | "interest" | "node";

const stepTwoSchema = z.object({
  profilePhoto: z
    .instanceof(File)
    .nullable()
    .refine((file) => file, { message: "Profile photo is required." })
    .optional(),
  coverPhoto: z
    .instanceof(File)
    .nullable()
    .refine((file) => file, { message: "Cover photo is required." })
    .optional(),
});

type StepTwoType = z.infer<typeof stepTwoSchema>;

interface PictureFormProps {
  setStep: (step: Step) => void;
  userId?: string; // Add userId prop if you need to pass it
}

const PictureForm: React.FC<PictureFormProps> = ({ setStep, userId }) => {
  //global store
  const { verifyToken, setVerifyToken, globalUser, setGlobalUser } =
    useTokenStore((state) => state);

  const [formData, setFormData] = useState<Partial<StepTwoType>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<StepTwoType | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  const form = useForm<StepTwoType>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  // Set initial values for comparison
  useEffect(() => {
    setInitialValues(form.getValues());
  }, [form]);

  // Watch all form values and detect changes
  const watchedValues = form.watch();

  useEffect(() => {
    // Check if current values are different from initial values
    if (
      initialValues &&
      JSON.stringify(initialValues) !== JSON.stringify(watchedValues)
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [watchedValues, initialValues]);

  const onSubmit: SubmitHandler<StepTwoType> = async (data) => {
    try {
      setIsSubmitting(true);

      // Create FormData instance
      const formDataToSend = new FormData();

      // Append the files with the names matching your Multer configuration
      if (data.profilePhoto) {
        formDataToSend.append("profileImage", data.profilePhoto);
      }
      if (data.coverPhoto) {
        formDataToSend.append("coverImage", data.coverPhoto);
      }

      // Append userId if needed
      if (userId) {
        formDataToSend.append("userId", userId);
      }

      // Make the API call
      console.log("clicked");
      if (globalUser) {
        console.log("clicked");
        const response = await postPicture(globalUser._id, formDataToSend);

        console.log(response);

        if (!response.status) {
          throw new Error("Upload failed");
        }

        setGlobalUser(response.data);

        // const result = await response.json();
        // console.log("Upload successful:", result);

        // Move to next step if successful
        setStep("interest");
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="profilePhoto"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <FormControl>
                  <div className="overflow-hidden">
                    <PhotoInput
                      field="Profile"
                      onUpload={(file) => field.onChange(file)}
                      initialUrl={globalUser?.profileImage}
                      initialImageName={
                        globalUser?.profileImage && "currentProfileImage.jpg"
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coverPhoto"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Photo</FormLabel>
                <FormControl>
                  <div className="overflow-hidden">
                    <PhotoInput
                      field="Cover"
                      onUpload={(file) => field.onChange(file)}
                      initialUrl={globalUser?.coverImage}
                      initialImageName={
                        globalUser?.coverImage && "currentCoverImage.jpg"
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <div>
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
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
        </div> */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setStep("details")}
            disabled={isSubmitting}
          >
            Back
          </Button>
          {isChanged ? (
            <Button
              type="submit"
              className="text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Next"}
            </Button>
          ) : (
            <Button
              className="text-white"
              onClick={(e) => {
                e.preventDefault();
                setStep("interest");
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

export default PictureForm;
