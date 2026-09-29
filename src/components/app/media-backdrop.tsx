/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";

type MediaBackdropProps = {
  backdropUrl: string;
};

export function MediaBackdrop({ backdropUrl }: MediaBackdropProps) {
  return (
    <motion.div
      key="media-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="pointer-events-none fixed inset-0 z-0"
    >
      <img
        src={backdropUrl}
        alt=""
        aria-hidden
        className="h-full w-full scale-105 object-cover object-top opacity-50 blur-[2px] mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/80 to-stone-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent md:w-3/4" />
    </motion.div>
  );
}
