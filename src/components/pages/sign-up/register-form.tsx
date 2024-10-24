"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import IMG from "@/lib/constants";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { useEffect, useState } from "react";
import { EmailInput } from "./email-input";
import { checkVerified, googleAUth, signUp } from "./endpoint";
import { toast } from "sonner";
import router from "next/router";
import { app } from "@/lib/config/firebase";

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
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  // const router = useRouter();
  useEffect(() => {
    checkVerified()
      .then((res) => {
        setVerified(res.status);
      })
      .catch((err) => {
        console.log(err, "errrr");
      });
  }, []);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [verified, setVerified] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await signUp(data);
      // console.log(response, "resss");
      router.push("/sign-in");
      toast.success(response.message);
    } catch (error) {
      console.log(error, "errr");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // The signed-in user info
      const user = result.user;
      const response = await googleAUth({
        email: user.email,
        userName: user.displayName,
        imageUrl: user.photoURL,
        phoneNumber: user.phoneNumber,
      });
      toast.success(response.message);
      // You might want to store the user info in your backend
      try {
      } catch (error: any) {
        console.log(error, "errrr");

        toast.error(error.response.data.message);
      }

      toast.success("Successfully signed in with Google!");
      // router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
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
          <button
            onClick={handleGoogleSignIn}
            className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
          >
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
                disabled={!verified || form.formState.isSubmitting}
                type="submit"
                className="w-full rounded-lg disabled bg-primary p-2 text-white"
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
