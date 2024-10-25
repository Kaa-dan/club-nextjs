import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { verifyOtp } from "./endpoint";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { resendOtp } from "./endpoint";
type InputRefType = HTMLInputElement | null;

const RegisterOtp: React.FC<{
  email: string;
  setOpen: (open: boolean) => void;
  setVerified: (status: boolean) => void;
}> = ({ email, setOpen, setVerified }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<InputRefType[]>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer countdown logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown); // Cleanup interval on component unmount
    }
  }, [timer]);

  // Reset OTP, timer, and submission state when the dialog is reopened or closed
  useEffect(() => {
    const resetOtpPage = () => {
      setOtp(new Array(6).fill(""));
      setTimer(60);
      setCanResend(false);
      setIsSubmitting(false);
    };

    // Trigger reset when the page opens/closes
    resetOtpPage();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((value, index) => {
        if (index < 6) newOtp[index] = value;
      });
      setOtp(newOtp);
      if (pastedData.length === 6) inputRefs.current[5]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    try {
      // Reset OTP array
      setOtp(new Array(6).fill(""));

      // Reset timer and disable resend
      setTimer(60);
      setCanResend(false);
      const response = await resendOtp(email);
      toast.success(response.message);
      // Optionally, send the resend OTP request here
      // await resendOtp(); // Call your resend OTP endpoint
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Mark as submitting
    try {
      const response = await verifyOtp(otp.join(""), email);

      localStorage.setItem("verify-token", response.token);
      toast.success(response.message);

      // Clear the timer and reset OTP
      setTimer(60); // Reset the timer to 60 seconds
      setOtp(new Array(6).fill("")); // Reset OTP after successful verification
      setOpen(false); // Close the dialog
      setVerified(true); // Mark as verified
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false); // Reset the submission state after response
    }
  };

  return (
    <DialogContent
      onInteractOutside={(e) => e.preventDefault()}
      className="sm:max-w-[425px]"
    >
      <DialogHeader className="space-y-3">
        <DialogTitle className="text-2xl font-semibold tracking-tight">
          Verification Required
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Enter the 6-digit code we sent to your device to verify your account
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center space-y-8 py-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={cn(
                "h-14 w-14 rounded-md border text-center text-xl transition-all",
                "focus:border-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                digit ? "border-primary/50 bg-primary/5" : "border-input"
              )}
            />
          ))}
        </div>

        <div className="text-center">
          {canResend ? (
            <Button
              variant="outline"
              onClick={handleResendOtp}
              disabled={isSubmitting}
              className="h-9 text-sm"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Resend Code
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend code in{" "}
              <span className="font-medium text-primary">{timer}s</span>
            </p>
          )}
        </div>
      </div>

      <DialogFooter className="flex flex-col space-y-2">
        <Button
          onClick={handleSubmit}
          type="submit"
          className="w-full text-white"
          disabled={otp.join("").length !== 6 || isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify Account
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default RegisterOtp;
