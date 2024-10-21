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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  signed: z.boolean().default(false),
});

export function SignInForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      signed: false,
    },
  });

  const onSubmit = (values: any) => {
    console.log(values);
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
          <h2 className=" text-2xl font-bold">Hey, Welcome Back 👋</h2>
          <p className="text-xs text-gray-600">
            Login to an account and take advantage of exclusive benefits.
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
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
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
            </div>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="signed" className="border-gray-500" />
                <label
                  htmlFor="signed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Stay Signed In
                </label>
              </div>
              <div className="mb-4 flex justify-between">
                <Link href="/forgot-password" className="text-primary">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="pt-8">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full rounded-lg bg-primary p-2 text-white"
              >
                Login with Clubwize
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-3 text-center">
          <p>
            Didn’t have an account?{" "}
            <Link href="/sign-up" className="text-primary">
              Get Registered
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
