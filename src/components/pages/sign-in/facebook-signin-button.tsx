import { IMGS } from "@/lib/constants";
import Image from "next/image";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { app } from "@/lib/config/firebase";
import { signinWithSocial } from "./endpoint";
import { useTokenStore } from "@/store/store";
import { useRouter } from "next/navigation";

const FacebookSignIn = () => {
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
        signupThrough: "facebook",
      });

      console.log(response, "ress");

      // setting global state
      setGlobalUser(response?.data || null);
      setAccessToken(response?.token);

      toast.success(
        response.message || "Successfully signed in with Facebook!"
      );

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
      onClick={handleFacebookSignIn}
      className="mr-2 flex w-full items-center justify-center rounded-lg border p-2"
    >
      <Image src={IMGS?.Facebook} alt="Facebook" className="mr-2 h-6" />
      Facebook
    </button>
  );
};

export default FacebookSignIn;
