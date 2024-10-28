import { IMGS } from "@/lib/constants";
import { getAuth, signInWithPopup, OAuthProvider } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socialAuth } from "./endpoint"; // Renamed from googleAuth to socialAuth
import { app } from "@/lib/config/firebase";

const AppleSignup = () => {
  const router = useRouter();

  // Apple sign-in handler
  const socialSignup = async () => {
    try {
      const auth = getAuth(app); // Firebase auth instance
      const appleProvider = new OAuthProvider("apple.com"); // Apple provider

      // Add necessary scopes for Apple Sign-in
      appleProvider.addScope("email");
      appleProvider.addScope("name");

      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;

      // Note: Apple might not provide email on subsequent logins
      // and displayName might be available only on first login
      const response = await socialAuth({
        email: user.email,
        userName: user.displayName || "Apple User", // Fallback name if not provided
        imageUrl: user.photoURL || "", // Apple might not provide photo URL
        phoneNumber: user.phoneNumber || "",
        signupThrough: "apple",
      });

      localStorage.setItem("token", response.token);
      router.push("/onboarding");

      toast.success(response.message);
    } catch (error: any) {
      console.error("Error during Apple Sign-in:", error);
      toast.error("Apple Sign-in failed. Please try again.");
    }
  };

  return (
    <button
      onClick={socialSignup} // Place onClick here
      className="flex w-full items-center justify-center rounded-lg border p-2"
    >
      <Image src={IMGS?.Apple} alt="Apple" className="mr-2 h-6" />
      Apple
    </button>
  );
};

export default AppleSignup;
