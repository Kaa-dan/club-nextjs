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

type Step = "Details" | "Picture" | "Node";

const stepTwoSchema = z.object({
  profilePhoto: z
    .instanceof(File)
    .nullable()
    .refine((file) => file, { message: "Profile photo is required." }),
  coverPhoto: z
    .instanceof(File)
    .nullable()
    .refine((file) => file, { message: "Cover photo is required." }),
  terms: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions",
  }),
});

type StepTwoType = z.infer<typeof stepTwoSchema>;

interface PictureFormProps {
  setStep: (step: Step) => void;
  userId?: string; // Add userId prop if you need to pass it
}

const PictureForm: React.FC<PictureFormProps> = ({ setStep, userId }) => {
  //global store
  const { verifyToken, setVerifyToken, globalUser, setGlobalUser } =
    useTokenStore((state) => ({
      verifyToken: state.verifyToken,
      setVerifyToken: state.setVerifyToken,
      clearVerifyToken: state.clearVerifyToken,
      globalUser: state.globalUser,
      setGlobalUser: state.setGlobalUser,
    }));

  const [formData, setFormData] = useState<Partial<StepTwoType>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StepTwoType>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

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

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        console.log("Upload successful:", result);

        // Move to next step if successful
        setStep("Node");
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <FormControl>
                  <PhotoInput
                    field="Profile"
                    onUpload={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coverPhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Photo</FormLabel>
                <FormControl>
                  <PhotoInput
                    field="Cover"
                    onUpload={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
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
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            Back
          </Button>
          <Button type="submit" className="text-white" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PictureForm;
