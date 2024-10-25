import Image from "next/image";
import { toast } from "sonner";
import { googleAUth } from "./endpoint";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import IMG from "@/lib/constants";
import { app } from "@/lib/config/firebase";

const GoogleSignUp = () => {
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
      console.log(error, "errr");
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
        <Image src={IMG?.Google} alt="Google" className="mr-2 h-6" />
        Google
      </button>
    </>
  );
};
export default GoogleSignUp;
