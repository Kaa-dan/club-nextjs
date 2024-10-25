import Image from "next/image";
import IMG from "@/lib/constants";
import { toast } from "sonner";
import { signinWithSocial } from "./endpoint";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { app } from "@/lib/config/firebase";
const GoogleSignIn = () => {
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const response = await signinWithSocial({
        email: user.email,
        userName: user.displayName,
        imageUrl: user.photoURL,
        phoneNumber: user.phoneNumber,
      });

      toast.success(response.message);
    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
    >
      <Image src={IMG?.Google} alt="Google" className="mr-2 h-6" />
      Google
    </button>
  );
};

export default GoogleSignIn;
