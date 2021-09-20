import { motion } from "framer-motion";
import React from "react";
import cn from "classnames";
export default function Collapse({
  isOpen,
  className,
  initialyOpen,
  children,
  variants: externalVariants,
}) {
  const variants = {
    open: {
      height: "auto",
    },
    closed: {
      height: 0,
    },
  };
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      variants={externalVariants || variants}
      initial={initialyOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      transition={{
        stiffness: 200,
        damping: 200,
      }}
    >
      {children}
    </motion.div>
  );
}
