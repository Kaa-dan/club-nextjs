import { IMGS } from "@/lib/constants";
import Image from "next/image";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { app } from "@/lib/config/firebase";
import { signinWithSocial } from "./endpoint";
const FacebookSignIn = () => {
  const handleFacebookSignIn = async () => {
    const facebookProvider = new FacebookAuthProvider(); // Facebook provider
    facebookProvider.addScope("email");

    const auth = getAuth(app);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const response = await signinWithSocial({
        email: user.email,
        userName: user.displayName,
        imageUrl: user.photoURL,
        phoneNumber: user.phoneNumber,
      });

      toast.success(response.message);
    } catch (error: any) {
      console.error("Facebook Sign-in Error:", error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <button
      onClick={handleFacebookSignIn}
      className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
    >
      <Image src={IMGS?.Facebook} alt="Facebook" className="mr-2 h-6" />
      Facebook
    </button>
  );
};

export default FacebookSignIn;
