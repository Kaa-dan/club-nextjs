import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

interface ProfanityResponse {
  isProfanity: boolean;
  score: number;
  flaggedFor?: string;
}

interface UseProfanityProps {
  onProfanityDetected?: (result: ProfanityResponse) => void;
  debounceMs?: number;
  scoreThreshold?: number; // Optional threshold to customize sensitivity
}

export const useProfanity = ({
  onProfanityDetected,
  debounceMs = 500,
  scoreThreshold = 0.85, // Default threshold for considering content problematic
}: UseProfanityProps = {}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [profanityResult, setProfanityResult] = useState<ProfanityResponse>({
    isProfanity: false,
    score: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const cleanTextForCheck = (text: string): string => {
    const words = text.split(/\s+/);

    const cleanedWords = words.map((word) => {
      // If word is all special characters or numbers, ignore it
      if (/^[^a-zA-Z]*$/.test(word)) {
        return "";
      }

      // If word contains letters, keep only the letters
      return word.replace(/[^a-zA-Z]/g, "");
    });

    // Join words back together, filter out empty strings
    return cleanedWords.filter((word) => word.length > 0).join(" ");
  };

  const onProfanityDetectedRef = useRef(onProfanityDetected);
  useEffect(() => {
    onProfanityDetectedRef.current = onProfanityDetected;
  }, [onProfanityDetected]);

  const checkProfanityImpl = async (text: string) => {
    if (!text.trim()) {
      setProfanityResult({ isProfanity: false, score: 0 });
      setError(null);
      onProfanityDetectedRef.current?.({ isProfanity: false, score: 0 });
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      // Clean the text before sending to API
      const cleanedText = cleanTextForCheck(text);

      // If no meaningful text after cleaning, return false
      if (!cleanedText.trim()) {
        setProfanityResult({ isProfanity: false, score: 0 });
        setError(null);
        onProfanityDetectedRef.current?.({ isProfanity: false, score: 0 });
        return;
      }

      console.log("Checking text:", text);
      console.log("Cleaned text:", cleanedText);

      const response = await axios.post<ProfanityResponse>(
        process.env.NEXT_PUBLIC_PROFANITY_URL!,
        {
          message: cleanedText,
        }
      );

      const result = response.data;

      // Only consider it profanity if the cleaned text had a high enough score
      const enhancedResult = {
        ...result,
        isProfanity: result.score > scoreThreshold,
      };

      console.log("API Response:", result);
      console.log("Enhanced Result:", enhancedResult);

      setProfanityResult(enhancedResult);
      onProfanityDetectedRef.current?.(enhancedResult);
    } catch (err) {
      setError("Failed to check content");
      console.error("Profanity check error:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const debouncedCheck = useRef(
    debounce((text: string) => {
      checkProfanityImpl(text);
    }, debounceMs)
  ).current;

  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  return {
    checkProfanity: debouncedCheck,
    isChecking,
    profanityResult,
    error,
    hasProfanity: profanityResult.isProfanity,
    profanityScore: profanityResult.score,
    flaggedTerm: profanityResult.flaggedFor,
  };
};
