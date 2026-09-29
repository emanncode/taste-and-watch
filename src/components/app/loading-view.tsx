"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { AppState } from "@/lib/app-state";

const LOADING_COPY: Partial<Record<AppState, string>> = {
  SEARCHING: "Searching the cinematic archives...",
  MEDIA_LOADING: "Loading title details...",
};

type LoadingViewProps = {
  state: AppState;
};

export function LoadingView({ state }: LoadingViewProps) {
  return (
    <AnimatePresence mode="wait">
      {(state === "SEARCHING" || state === "MEDIA_LOADING") && (
        <motion.div
          key={`loading-${state}`}
          className="mt-20 flex flex-1 flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="mb-6 h-12 w-12 rounded-full border-2 border-orange-500/20 border-t-orange-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg tracking-wide text-stone-400">
            {LOADING_COPY[state]}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
