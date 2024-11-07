import { useState, useEffect } from "react";

// Generic type for params
type DynamicParams = Record<string, string>;

// Type for the hook return value
type UseParamsReturn<T extends DynamicParams> = {
  params: Partial<T>;
  isLoading: boolean;
  error: Error | null;
};

export const useHandleParams = <T extends DynamicParams>(
  initialParams: Promise<T> | T
): UseParamsReturn<T> => {
  const [params, setParams] = useState<Partial<T>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        setIsLoading(true);
        const resolvedParams = await initialParams;
        setParams(resolvedParams);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch params")
        );
      } finally {
        setIsLoading(false);
      }
    };

    unwrapParams();
  }, [initialParams]);

  return { params, isLoading, error };
};
