"use client";
import { motion } from "framer-motion";
import React from "react";
export const PageWrapper = ({ children }) => {
  return (
    <motion.div
      className="mt-10 px-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export const PageHeader = ({ children, component }) => {
  return (
    <motion.div
      className="flex mb-6 items-center justify-between mt-10 scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>
      {component && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {component}
        </motion.div>
      )}
    </motion.div>
  );
};
