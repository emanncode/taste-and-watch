"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaPosterCard } from "@/components/app/media-poster-card";
import type { MediaSearchResult } from "@/lib/services/media";
import type { MediaFilter, MediaSort } from "@/lib/app-state";
import { EASE_OUT, fadeIn, fadeUp, staggerContainer } from "@/lib/motion";

type SearchResultsViewProps = {
  query: string;
  results: MediaSearchResult[];
  currentPage: number;
  totalPages: number;
  filterType: MediaFilter;
  sortBy: MediaSort;
  onFilterChange: (value: MediaFilter) => void;
  onSortChange: (value: MediaSort) => void;
  onSelect: (media: MediaSearchResult) => void;
  onPageChange: (page: number) => void;
};

const FILTER_LABELS: Record<MediaFilter, string> = {
  all: "All Types",
  movie: "Movies",
  tv: "TV Shows",
};

const SORT_LABELS: Record<MediaSort, string> = {
  relevance: "Sort: Relevance",
  newest: "Sort: Newest",
  oldest: "Sort: Oldest",
  title: "Sort: Title (A-Z)",
};

export function SearchResultsView({
  query,
  results,
  currentPage,
  totalPages,
  filterType,
  sortBy,
  onFilterChange,
  onSortChange,
  onSelect,
  onPageChange,
}: SearchResultsViewProps) {
  return (
    <motion.section
      key="search-results"
      className="pt-12"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={staggerContainer(0.05, 0)}
    >
      <motion.div
        className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        variants={fadeUp}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <h2 className="text-2xl font-medium tracking-tight text-stone-200">
          Search results for{" "}
          <span className="font-bold text-white">&quot;{query}&quot;</span>
        </h2>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Select
            items={FILTER_LABELS}
            value={filterType}
            onValueChange={(value) => onFilterChange(value as MediaFilter)}
          >
            <SelectTrigger
              aria-label="Filter by media type"
              className="w-full border-stone-700/50 bg-stone-900/60 text-stone-300 backdrop-blur-sm hover:bg-stone-800 sm:w-auto"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FILTER_LABELS) as MediaFilter[]).map((value) => (
                <SelectItem key={value} value={value}>
                  {FILTER_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={SORT_LABELS}
            value={sortBy}
            onValueChange={(value) => onSortChange(value as MediaSort)}
          >
            <SelectTrigger
              aria-label="Sort results"
              className="w-full border-stone-700/50 bg-stone-900/60 text-stone-300 backdrop-blur-sm hover:bg-stone-800 sm:w-auto"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as MediaSort[]).map((value) => (
                <SelectItem key={value} value={value}>
                  {SORT_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6 lg:gap-8"
        variants={staggerContainer(0.045, 0.12)}
      >
        {results.length === 0 ? (
          <motion.p
            className="col-span-full py-12 text-center text-stone-500"
            variants={fadeIn}
          >
            No results match your filters.
          </motion.p>
        ) : (
          results.map((media) => (
            <MediaPosterCard
              key={`${media.mediaType}-${media.id}`}
              media={media}
              onSelect={onSelect}
            />
          ))
        )}
      </motion.div>

      {totalPages > 1 && (
        <motion.nav
          aria-label="Search result pages"
          className="mt-12 flex items-center justify-center gap-4"
          variants={fadeUp}
        >
          <Button
            variant="outline"
            size="lg"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-auto rounded-full border-stone-800/80 bg-stone-900/80 px-5 py-2.5 text-sm font-semibold text-stone-200 hover:bg-stone-800 hover:text-stone-200"
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-stone-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="lg"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-auto rounded-full border-stone-800/80 bg-stone-900/80 px-5 py-2.5 text-sm font-semibold text-stone-200 hover:bg-stone-800 hover:text-stone-200"
          >
            Next
          </Button>
        </motion.nav>
      )}
    </motion.section>
  );
}
