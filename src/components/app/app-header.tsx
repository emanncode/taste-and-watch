"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EASE_OUT } from "@/lib/motion";

type AppHeaderProps = {
  visible: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onReset: () => void;
};

export function AppHeader({
  visible,
  query,
  onQueryChange,
  onSearch,
  onReset,
}: AppHeaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          key="app-header"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="sticky top-0 z-40 w-full border-b border-stone-800/50 bg-stone-950/70 backdrop-blur-xl"
        >
          <div className="mx-auto flex h-20 w-full items-center justify-between gap-3 px-[5%] sm:gap-6">
            <Button
              variant="ghost"
              onClick={onReset}
              className="group h-auto shrink-0 gap-2.5 rounded-sm px-0 hover:bg-transparent sm:gap-3.5"
            >
              <UtensilsCrossed
                className="shrink-0 text-orange-500 size-7 sm:size-6 lg:size-8"
                strokeWidth={1.75}
              />
              <span className="hidden text-2xl font-bold tracking-tight text-stone-50 transition-colors group-hover:text-orange-400 sm:inline lg:text-3xl">
                Taste &amp; Watch
              </span>
            </Button>

            <form
              onSubmit={onSearch}
              role="search"
              className="group relative w-full sm:max-w-sm md:max-w-md"
            >
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-orange-400"
                aria-hidden
              />
              <Input
                type="search"
                placeholder="Search a movie or show..."
                aria-label="Search a movie or show"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="h-11 rounded-full border-stone-800/80 bg-stone-900/50 pl-11 pr-4 text-stone-100 shadow-sm hover:border-stone-700 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20 focus-visible:bg-stone-900 [&::-webkit-search-cancel-button]:hidden"
              />
            </form>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
