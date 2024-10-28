"use-client";

import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import RegisterOtp from "./register-otp";
import { Dialog } from "@/components/ui/dialog";
import { checkVerified, sendOtp } from "./endpoint";
import { toast } from "sonner";
import { useTokenStore } from "@/store/store";

const EmailInput = forwardRef<HTMLInputElement, any>(
  ({ className, setVerified, isVerified, setValue, ...props }, ref) => {
    //global store
    const { verifyToken, setVerifyToken, clearVerifyToken } = useTokenStore(
      (state) => ({
        verifyToken: state.verifyToken,
        setVerifyToken: state.setVerifyToken,
        clearVerifyToken: state.clearVerifyToken,
      })
    );
    //state for email
    const [email, setEmail] = useState("");

    // Modal open state
    const [open, setOpen] = useState(false);

    const handleSubmit = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate email format
      if (!emailRegex.test(email)) {
        toast.success("Invalid email format");
        return;
      }

      try {
        // storing response and senting otp
        const response = await sendOtp(email);

        if (response.status.status) {
          // sending message
          toast.success(response.message);

          //open modal
          setOpen(true);
        }
      } catch (error: any) {
        //handling error
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    return (
      <div className="relative">
        <Input
          type="email"
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
          onChange={(e) => {
            const inputEmail = e.target.value;
            setEmail(inputEmail.toLowerCase().trim());
            setValue("email", inputEmail.toLowerCase().trim());

            if (verifyToken) {
              checkVerified()
                .then((res) => {
                  if (res.data.email === inputEmail) {
                    setVerified(true);
                  } else {
                    setVerified(false);
                  }
                })
                .catch((err) => {
                  setVerified(false);
                });
            }
          }}
          value={email}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          disabled={isVerified}
        >
          {isVerified ? (
            <span className="text-xs text-primary">Verified!</span>
          ) : (
            <span onClick={handleSubmit} className="text-xs text-danger">
              Verify
            </span>
          )}
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          {open ? (
            <RegisterOtp
              setVerified={setVerified}
              setOpen={setOpen}
              email={email}
            />
          ) : (
            ""
          )}
        </Dialog>

        {/* hides browsers password toggles */}
        <style jsx>{`
          input::-ms-reveal,
          input::-ms-clear {
            display: none;
          }
        `}</style>
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";

export { EmailInput };
