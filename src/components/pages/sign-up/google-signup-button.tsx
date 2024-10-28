import Image from "next/image";
import { toast } from "sonner";
import { googleAUth } from "./endpoint";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { IMGS } from "@/lib/constants";
import { app } from "@/lib/config/firebase";
import { useRouter } from "next/navigation";

const GoogleSignUp = () => {
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth(app);

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
    <>
      <button
        onClick={handleGoogleSignIn}
        className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
      >
        <Image src={IMGS?.Google} alt="Google" className="mr-2 h-6" />
        Google
      </button>
    </>
  );
};
export default GoogleSignUp;
