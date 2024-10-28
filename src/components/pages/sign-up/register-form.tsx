"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GoogleSignUp from "./google-signup-button";
import FacebookSignup from "./facebook-signup-button.";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { IMGS } from "@/lib/constants";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { EmailInput } from "./email-input";
import { signUp } from "./endpoint";
import { toast } from "sonner";
import AppleSignup from "./apple-signup-button";

// Define form schema using Zod for validation
const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [verified, setVerified] = useState(false);

  // Initialize react-hook-form with Zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form submit handler for email/password signup
  const onSubmit = async (data: any) => {
    try {
      const response = await signUp(data);
      toast.success(response.message);
      router.push("/onboarding");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={IMGS?.Logo}
            width={40}
            height={40}
            alt="logo"
            className="py-2"
          />
          <h2 className="text-2xl font-bold">Welcome to Clubwize 👋</h2>
          <p className="text-xs text-gray-600">
            Welcome to the team, rookie! Get ready to crush it with Clubwize!
          </p>
        </div>

        {/* Social Auth Buttons */}
        <div className="mb-4 flex justify-between">
          <GoogleSignUp />
          <FacebookSignup />
          <AppleSignup />
        </div>

        {/* OR separator */}
        <div className="flex items-center px-16 py-4">
          <div className="grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* Sign-up form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <EmailInput
                        placeholder="Enter your email"
                        {...field}
                        setVerified={setVerified}
                        isVerified={verified}
                        setValue={form.setValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-8">
              <Button
                disabled={!verified || form.formState.isSubmitting}
                type="submit"
                className="w-full rounded-lg bg-primary p-2 text-white"
              >
                Continue with Clubwize
              </Button>
            </div>
          </form>
        </Form>

        {/* Login link */}
        <div className="mt-3 text-center text-gray-600">
          <p>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
