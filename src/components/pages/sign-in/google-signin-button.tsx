import Image from "next/image";
import { IMGS } from "@/lib/constants";
import { toast } from "sonner";
import { signinWithSocial } from "./endpoint";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { app } from "@/lib/config/firebase";
import { useTokenStore } from "@/store/store";
import { useRouter } from "next/navigation";

const GoogleSignIn = () => {
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
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log(user, "sladfla");

      const response = await signinWithSocial({
        email: user.email,
        userName: user.displayName,
        imageUrl: user.photoURL,
        phoneNumber: user.phoneNumber,
        signupThrough: "google",
      });

      console.log(response?.data?.isOnBoarded, "sdafasfd");
      toast.success(response.message || "Successfully signed in with Google!");

      // setting global state
      setGlobalUser(response?.data || null);
      setAccessToken(response?.token);

      response?.data?.isOnBoarded
        ? router.replace("/")
        : router.replace("/onboarding");
    } catch (error: any) {
      console.log(error?.response?.data);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
    >
      <Image src={IMGS?.Google} alt="Google" className="mr-2 h-6" />
      Google
    </button>
  );
};

export default GoogleSignIn;
