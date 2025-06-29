"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

const page = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <motion.div
      layoutRoot
      initial={{ filter: "blur(10px)", y: 50 }}
      animate={{ filter: "blur(0px)", y: 0 }}
      transition={{ duration: 3, type: "spring", stiffness: 300 }}
    >
      Type Together
    </motion.div>
  );
};

export default page;
