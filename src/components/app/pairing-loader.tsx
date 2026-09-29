"use client";

import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";

export function PairingLoader() {
  return (
    <motion.div
      key="pairings-loading"
      className="flex flex-1 flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-8 h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-stone-800" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 m-auto h-8 w-8 text-orange-500"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChefHat className="h-full w-full text-orange-500" strokeWidth={1.5} />
        </motion.div>
      </div>

      <motion.h3
        className="text-xl font-medium text-stone-200"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        Crafting the perfect menu...
      </motion.h3>
      <p className="mt-3 text-sm text-stone-500">
        Analyzing thematic elements and on-screen cuisine
      </p>
    </motion.div>
  );
}
