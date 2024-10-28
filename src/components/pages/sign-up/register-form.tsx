"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GoogleSignUp from "./google-signup-button";
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
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .transform((val) => val.toLowerCase()),
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

export function SignUpForm(): JSX.Element {
  //global store
  const { verifyToken, setVerifyToken, globalUser, setGlobalUser } =
    useTokenStore((state) => ({
      verifyToken: state.verifyToken,
      setVerifyToken: state.setVerifyToken,
      clearVerifyToken: state.clearVerifyToken,
      globalUser: state.globalUser,
      setGlobalUser: state.setGlobalUser,
    }));

  console.log({ verifyToken, globalUser });
  const router = useRouter();
  const facebookProvider = new FacebookAuthProvider();
  const auth: Auth = getAuth(app);

  const [verified, setVerified] = useState<boolean>(false);

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

      // setting global state
      setGlobalUser(response?.data || null);

      // sending message
      toast.success(response.message);

      //handling route to onboarding section
      router.push("/onboarding");
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
      const result: UserCredential = await signInWithPopup(
        auth,
        facebookProvider
      );
      const user = result.user;
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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src={IMGS?.Logo}
            width={40}
            height={40}
            alt="logo"
            className="py-2"
            priority
          />
          <h2 className="text-2xl font-bold">Welcome to clubwize 👋</h2>
          <p className="text-xs text-gray-600">
            Welcome to the team, rookie! Get ready to crush it with Clubwize!
          </p>
        </div>

        <div className="mb-4 flex justify-between">
          <GoogleSignUp />
          <button
            onClick={handleFacebookSignIn}
            className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
            type="button"
          >
            <Image
              src={IMGS?.Facebook}
              alt="Facebook"
              className="mr-2 h-6"
              width={24}
              height={24}
            />
            Facebook
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg border p-2"
          >
            <Image
              src={IMGS?.Apple}
              alt="Apple"
              className="mr-2 h-6"
              width={24}
              height={24}
            />
            Apple
          </button>
        </div>

        <div className="flex items-center px-16 py-4">
          <div className="grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

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
                className="w-full rounded-lg disabled:opacity-50 bg-primary p-2 text-white"
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
