import { checkVerified } from "@/components/pages/sign-up/endpoint";
import { useTokenStore } from "@/store/store";
import { useState, useEffect } from "react";

interface UseCheckTokenReturn {
  token: string | null;
  loading: boolean;
}

function useCheckToken(dependencies: any[] = []): UseCheckTokenReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const { accessToken, clearAccessToken, globalUser } = useTokenStore();

  useEffect(() => {
    const checkToken = async () => {
      if (!accessToken) {
        setLoading(false); // Skip check if no token is available
        return;
      }

      setLoading(true);
      try {
        const tokenVerify = await checkVerified();

        if (tokenVerify?.status !== 200) {
          clearAccessToken(); // Clear token if verification fails
        }
      } catch (error) {
        console.error("Token verification error", error);
        clearAccessToken();
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [accessToken, ...dependencies]);

  return { token: accessToken, loading };
}

export default useCheckToken;
