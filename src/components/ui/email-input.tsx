"use-client";

import { forwardRef, useState } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const EmailInput = forwardRef<HTMLInputElement, any>(
  ({ isVerified, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          type="email"
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
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
            <span className="text-xs text-primary">Verify</span>
          )}
        </Button>

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
