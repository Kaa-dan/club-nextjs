"use-client";

import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import RegisterOtp from "./register-otp";
import { Dialog } from "@/components/ui/dialog";
import { checkVerified, sendOtp } from "./endpoint";
import { toast } from "sonner";
const EmailInput = forwardRef<HTMLInputElement, any>(
  ({ className, setVerified, isVerified, setValue, ...props }, ref) => {
    const [email, setEmail] = useState("");
    const [open, setOpen] = useState(false); // Modal open state

    const handleSubmit = async () => {
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate email format
      // if (!emailRegex.test(email)) {
      //   console.log("Invalid email format");
      //   return;
      // }

      try {
        const response = await sendOtp(email);
        // console.log(response.status, "resss");

        // Assuming the API returns an object with a `status` field
        if (response.status.status) {
          toast.success(response.message);
          setOpen(true); // Open the modal if the OTP is sent successfully
        }
      } catch (error: any) {
        console.log(error, "err");
        if (error.response) {
          toast.error(error.response.data.message); // Log error if the request fails
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
            setEmail(inputEmail);
            setValue("email", inputEmail);

            if (localStorage.getItem("verify-token")) {
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
            <span className="text-xs text-gray-500">Verified!</span>
          ) : (
            <span onClick={handleSubmit} className="text-xs text-primary">
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
