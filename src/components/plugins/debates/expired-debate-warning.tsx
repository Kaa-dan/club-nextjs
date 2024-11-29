"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ExpiredDebateWarning() {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
      }}
    >
      <Alert variant="destructive" className="mx-auto max-w-md">
        <AlertTriangle className="size-4" />
        <AlertTitle>Debate Expired</AlertTitle>
        <AlertDescription>
          This debate has expired and is no longer active. You can view the
          content, but new contributions are not allowed.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
