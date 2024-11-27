import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface SkeletonProps extends HTMLMotionProps<"div"> {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200",
        className
      )}
      {...props}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        animate={{
          transform: ["translateX(-100%)", "translateX(100%)"],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}

export { Skeleton };
