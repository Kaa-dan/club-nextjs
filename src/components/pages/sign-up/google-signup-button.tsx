import Image from "next/image";
import { toast } from "sonner";
import { socialAuth } from "./endpoint";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { IMGS } from "@/lib/constants";
import { app } from "@/lib/config/firebase";
import { useRouter } from "next/navigation";
import { useTokenStore } from "@/store/store";

const GoogleSignUp = () => {
  const { globalUser, setGlobalUser, setAccessToken } = useTokenStore(
    (state) => ({
      verifyToken: state.verifyToken,
      setVerifyToken: state.setVerifyToken,
      clearVerifyToken: state.clearVerifyToken,
      globalUser: state.globalUser,
      setGlobalUser: state.setGlobalUser,
      setAccessToken: state.setAccessToken,
    })
  );

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

      console.log(response);

      // setting global state
      setGlobalUser(response?.data || null);
      setAccessToken(response?.token);

      toast.success(response.message || "Successfully signed in with Google!");

      response?.data?.isOnBoarded
        ? router.replace("/")
        : router.replace("/onboarding");
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
