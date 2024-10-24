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

type Step = "Details" | "Picture" | "Node";

const   stepTwoSchema = z.object({
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
}

const PictureForm: React.FC<PictureFormProps> = ({ setStep }) => {
  const [formData, setFormData] = useState<Partial<StepTwoType>>({});

  const form = useForm<StepTwoType>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  const onSubmit: SubmitHandler<StepTwoType> = (data) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);

    console.log("Data for Picture step:", data);
    console.log("Cumulative form data:", newFormData);

    setStep("Node");
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
          <Button type="submit" className="text-white">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PictureForm;
