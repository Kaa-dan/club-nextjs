"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Image from "next/image";
import IMG from "@/lib/constants";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { EyeIcon } from "lucide-react";
import { EmailInput } from "@/components/ui/email-input";

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
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md ">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={IMG?.Logo}
            width={40}
            height={40}
            alt="logo"
            className="py-2"
          />
          <h2 className=" text-2xl font-bold">Welcome to clubwize 👋</h2>
          <p className="text-xs text-gray-600">
            Welcome to the team, rookie! Get ready to crush it with Clubwize!
          </p>
        </div>
        <div className="mb-4 flex justify-between">
          <button className="mr-2 flex w-full items-center justify-center rounded-lg border p-2">
            <Image src={IMG?.Google} alt="Google" className="mr-2 h-6" />
            Google
          </button>
          <button className="mr-2 flex w-full items-center justify-center rounded-lg border p-2">
            <Image src={IMG?.Facebook} alt="Facebook" className="mr-2 h-6" />
            Facebook
          </button>
          <button className="flex w-full items-center justify-center rounded-lg border p-2">
            <Image src={IMG?.Apple} alt="Apple" className="mr-2 h-6" />
            Apple
          </button>
        </div>

        {/* OR separator */}
        <div className="flex items-center px-16 py-4">
          <div className="grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* Sign-in form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-2">
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
                        isVerified={true}
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
                    <FormLabel>Confirm</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Confirm your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-8">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full rounded-lg bg-primary p-2 text-white"
              >
                Continue with Clubwize
              </Button>
            </div>
          </form>
        </Form>
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
