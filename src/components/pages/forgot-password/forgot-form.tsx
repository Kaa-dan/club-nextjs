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
import { IMGS } from "@/lib/constants";
import Link from "next/link";
import { forgotPassword } from "./endpoint";
import { log } from "console";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function ForgotForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const { email } = values;

      const response = await forgotPassword(email);
      console.log(response, "resss");
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
      // console.log(error, "errr");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md ">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={IMGS?.Logo}
            width={40}
            height={40}
            alt="logo"
            className="py-2"
          />
          <h2 className=" text-2xl font-bold">Forgot password 🔓</h2>
          <p className="text-xs text-gray-600">
            {`No Worries, we'll send you reset instructions.`}
          </p>
        </div>

        {/* Forgot form */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
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

            <div className="pt-16">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full rounded-lg bg-primary p-2 text-white"
              >
                Forgot password
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-3 text-center">
          <p>
            Remember you password?{" "}
            <Link href="/sign-in" className="text-primary">
              Back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
