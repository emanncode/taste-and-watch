"use client";

import { motion } from "framer-motion";
import { Search, UtensilsCrossed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";

type LandingViewProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
};

export function LandingView({
  query,
  onQueryChange,
  onSearch,
}: LandingViewProps) {
  return (
    <motion.div
      key="landing"
      className="flex flex-1 flex-col items-center justify-center text-center"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={staggerContainer(0.14, 0.05)}
    >
      <motion.div
        className="relative mb-10"
        variants={fadeUp}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <div className="absolute inset-0 h-full w-full scale-150 rounded-full bg-orange-500/10 blur-3xl" />
        <UtensilsCrossed
          className="relative z-10 mx-auto mb-6 h-16 w-16 text-orange-500"
          strokeWidth={1.5}
        />
        <h1 className="relative z-10 text-5xl font-bold leading-tight tracking-tighter text-stone-50 md:text-7xl">
          Taste &amp; Watch
        </h1>
        <p className="relative z-10 mx-auto mt-4 max-w-2xl text-xl font-light tracking-wide text-stone-400 md:text-2xl">
          What should I eat while watching this?
        </p>
      </motion.div>

      <motion.form
        onSubmit={onSearch}
        role="search"
        className="group relative z-10 w-full max-w-2xl"
        variants={fadeUp}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <Search
          className="pointer-events-none absolute left-6 top-1/2 h-6 w-6 z-999 -translate-y-1/2 text-stone-500 transition-colors group-focus-within:text-orange-400"
          aria-hidden
        />
        <Input
          type="search"
          autoFocus
          placeholder="Enter a movie or TV show title..."
          aria-label="Enter a movie or TV show title"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="h-16 rounded-full border-stone-800/80 bg-stone-900/60 pl-16 z-0 pr-6 text-lg shadow-2xl backdrop-blur-sm hover:border-stone-700 focus-visible:border-orange-500/50 focus-visible:bg-stone-900 focus-visible:ring-4 focus-visible:ring-orange-500/10 md:h-20 md:text-xl [&::-webkit-search-cancel-button]:hidden"
        />
      </motion.form>
    </motion.div>
  );
}
