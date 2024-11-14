"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GoogleSignUp from "./google-signup-button";
import FacebookSignup from "./facebook-signup-button.";
import {
  getAuth,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  UserCredential,
  Auth,
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
import { IMGS } from "@/lib/constants";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";

import AppleSignup from "./apple-signup-button";

// Define form schema using Zod for validation
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { EmailInput } from "./email-input";
import { signUp } from "./endpoint";
import { toast } from "sonner";
import { app } from "@/lib/config/firebase";
import { useTokenStore } from "@/store/store";

// Type definitions
type FormSchema = z.infer<typeof formSchema>;

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface EmailInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVerified: Dispatch<SetStateAction<boolean>>;
  isVerified: boolean;
  setValue: (name: string, value: string) => void;
}

type FirebaseError = {
  code: string;
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

// Zod schema with types
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

export function SignUpForm(): React.JSX.Element {
  //global store
  const {
    verifyToken,
    setVerifyToken,
    globalUser,
    setGlobalUser,
    setAccessToken,
  } = useTokenStore((state) => ({
    verifyToken: state.verifyToken,
    setVerifyToken: state.setVerifyToken,
    clearVerifyToken: state.clearVerifyToken,
    globalUser: state.globalUser,
    setGlobalUser: state.setGlobalUser,
    setAccessToken: state.setAccessToken,
  }));

  console.log({ verifyToken, globalUser });
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [verified, setVerified] = useState(false);

  // Initialize react-hook-form with Zod resolver

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Type-safe email change handler
  const handleEmailChange = (
    value: string,
    field: {
      onChange: (value: string) => void;
      onBlur: () => void;
      value: string;
      name: string;
    }
  ): void => {
    const lowercaseEmail = value.toLowerCase();
    field.onChange(lowercaseEmail);
  };

  // Type-safe submit handler
  const onSubmit = async (data: SignUpFormData): Promise<void> => {
    try {
      // storing response and api calling
      const response = await signUp(data);
      toast.success(response.message);

      // setting global state
      setGlobalUser(response?.data || null);
      setAccessToken(response?.token);

      router.replace("/onboarding");
    } catch (error) {
      //checking type
      const typedError = error as FirebaseError;

      // handling error
      if (typedError.response) {
        toast.error(typedError.response.data?.message || "An error occurred");
      } else {
        toast.error(typedError.message || "An error occurred");
      }
    }
  };

  // Type-safe Facebook sign in handler
  const handleFacebookSignIn = async (): Promise<void> => {
    try {
      // const result: UserCredential = await signInWithPopup(
      //   auth,
      //   facebookProvider
      // );
      // const user = result.user;
      // Uncomment when ready to use
      // const response = await googleAuth({
      //   email: user.email,
      //   userName: user.displayName,
      //   imageUrl: user.photoURL,
      //   phoneNumber: user.phoneNumber,
      // });
      // toast.success(response.message);
      toast.success("Successfully signed in with Facebook!");
    } catch (error) {
      const typedError = error as FirebaseError;
      console.error(error);
      toast.error(
        typedError.response?.data?.message || "Failed to sign in with Facebook"
      );
    }
  };
  return (
    <div className="flex h-screen max-h-dvh  items-center justify-center overflow-hidden">
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
        <div className="mb-4 flex  flex-col justify-between">
          <div className="flex justify-between">
            <GoogleSignUp />
            <FacebookSignup />
            <AppleSignup />
          </div>

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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEmailChange(e.target.value, field)
                          }
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
                  className="w-full rounded-lg bg-primary p-2 text-white disabled:opacity-50"
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
    </div>
  );
}
