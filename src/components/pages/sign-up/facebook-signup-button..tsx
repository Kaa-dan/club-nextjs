import IMG from "@/lib/constants";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import router from "next/router";
import { toast } from "sonner";
import { googleAUth } from "./endpoint";
import { app } from "@/lib/config/firebase";
const FacebookSignup = () => {
  // Facebook sign-in handler
  const handleFacebookSignIn = async () => {
    try {
      const auth = getAuth(app); // Firebase auth instance
      const facebookProvider = new FacebookAuthProvider(); // Facebook provider
      facebookProvider.addScope("email");
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const response = await googleAUth({
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
      console.log(error, "errrr");

      toast.error("user exist with this email!!");
    }
  };
  return (
    <button
      onClick={handleFacebookSignIn}
      className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
    >
      <Image src={IMG?.Facebook} alt="Facebook" className="mr-2 h-6" />
      Facebook
    </button>
  );
};

export default FacebookSignup;
