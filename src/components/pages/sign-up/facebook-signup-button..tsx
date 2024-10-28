import { IMGS } from "@/lib/constants";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socialAuth } from "./endpoint";
import { app } from "@/lib/config/firebase";

const FacebookSignup = () => {
  const router = useRouter();
  // Facebook sign-in handler
  const socialSignup = async () => {
    try {
      const auth = getAuth(app); // Firebase auth instance
      const facebookProvider = new FacebookAuthProvider(); // Facebook provider
      facebookProvider.addScope("email");
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const response = await socialAuth({
        email: user.email,
        userName: user.displayName,
        imageUrl: user.photoURL,
        phoneNumber: user.phoneNumber,
        signupThrough: "facebook",
      });
      localStorage.setItem("token", response.token);
      router.push("/onboarding");

      toast.success(response.message);
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Failed to sign in with Google"
        );
      } else {
        toast.error(error.message);
      }
    }
  };
  return (
    <button
      onClick={socialSignup}
      className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
    >
      <Image src={IMGS?.Facebook} alt="Facebook" className="mr-2 h-6" />
      Facebook
    </button>
  );
};

export default FacebookSignup;
