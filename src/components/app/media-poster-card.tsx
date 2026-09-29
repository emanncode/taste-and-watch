/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { Film, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MediaSearchResult } from "@/lib/services/media";
import { EASE_OUT, fadeUp } from "@/lib/motion";

type MediaPosterCardProps = {
  media: MediaSearchResult;
  onSelect: (media: MediaSearchResult) => void;
};

export function MediaPosterCard({ media, onSelect }: MediaPosterCardProps) {
  const isMovie = media.mediaType === "movie";
  const Icon = isMovie ? Film : Tv;

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
    >
      <Button
        variant="outline"
        onClick={() => onSelect(media)}
        aria-label={`View details for ${media.title}`}
        className="group relative aspect-[2/3] h-auto w-full flex-col items-stretch gap-0 overflow-hidden rounded-2xl border-stone-700/50 bg-stone-900/40 p-0 text-left shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] transition-shadow duration-300 hover:-translate-y-1 hover:border-stone-700/50 hover:bg-stone-900/40 hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.08)]"
      >
        <div className="absolute inset-0 bg-stone-950">
          {media.posterUrl ? (
            <img
              src={media.posterUrl}
              alt={media.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-stone-900/50 text-stone-600">
              <Icon className="mb-3 h-10 w-10" strokeWidth={1} aria-hidden />
              <span className="text-xs font-medium uppercase tracking-widest">
                No Poster
              </span>
            </div>
          )}
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent opacity-90 transition-opacity duration-300"
          aria-hidden
        />

        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col justify-end p-4 md:p-5">
          <h3
            className={`mb-2.5 font-bold leading-tight text-stone-50 drop-shadow-lg transition-colors group-hover:text-orange-400 [text-wrap:balance] ${
              media.title.length > 20 ? "text-lg md:text-xl" : "text-xl md:text-2xl"
            }`}
          >
            {media.title}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-300 drop-shadow-md md:text-xs">
            <span>{media.releaseYear || "N/A"}</span>
            <span className="text-stone-500" aria-hidden>
              •
            </span>
            <span>{isMovie ? "Movie" : "TV"}</span>
            {media.primaryGenre && (
              <>
                <span className="text-stone-500" aria-hidden>
                  •
                </span>
                <span className="max-w-[80px] truncate text-orange-400/90 sm:max-w-[100px]">
                  {media.primaryGenre}
                </span>
              </>
            )}
          </div>
        </div>
      </Button>
    </motion.div>
  );
}
