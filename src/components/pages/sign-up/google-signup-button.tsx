import Image from "next/image";
import { toast } from "sonner";
import { socialAuth } from "./endpoint";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { IMGS } from "@/lib/constants";
import { app } from "@/lib/config/firebase";
import { useRouter } from "next/navigation";

const GoogleSignUp = () => {
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth(app);

  const socialSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // The signed-in user info
      const user = result.user;
      const response = await socialAuth({
        email: user.email,
        userName: user.displayName,
        imageUrl: user.photoURL,
        phoneNumber: user.phoneNumber,
        signupThrough: "google",
      });
      localStorage.setItem("token", response.token);
      router.push("/onboarding");

      toast.success(response.message);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <button
      onClick={socialSignup}
      className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
    >
      <Image src={IMGS?.Google} alt="Google" className="mr-2 h-6" />
      Google
    </button>
  );
};
export default GoogleSignUp;
