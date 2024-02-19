"use client";
import { motion } from "framer-motion";

const Animation = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "linear", duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Animation;
