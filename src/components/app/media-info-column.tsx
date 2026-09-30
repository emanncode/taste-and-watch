/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { MediaDetails } from "@/lib/services/media";
import { EASE_OUT, fadeUp, scaleIn } from "@/lib/motion";

type MediaInfoColumnProps = {
  media: MediaDetails;
};

export function MediaInfoColumn({ media }: MediaInfoColumnProps) {
  return (
    <div className="flex w-full flex-col flex-shrink-0 md:w-[350px] lg:w-[400px]">
      <motion.div
        className="relative mb-8 aspect-[2/3] w-full overflow-hidden rounded-2xl border border-stone-800/50 bg-stone-900 shadow-2xl md:mx-0 md:w-full"
        variants={scaleIn}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        {media.posterUrl ? (
          <img
            src={media.posterUrl}
            alt={media.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-900/50 text-stone-600">
            <span className="text-sm uppercase tracking-widest">No Poster</span>
          </div>
        )}
      </motion.div>

      <motion.div
        className="space-y-6 text-center md:text-left"
        variants={fadeUp}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 }}
      >
        <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          {media.title}
        </h2>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm md:justify-start">
          <Badge
            variant="outline"
            className="h-auto border-orange-500/20 bg-orange-500/10 px-3 py-1 text-orange-400"
          >
            {media.releaseYear || "Unknown Year"}
          </Badge>
          {media.genres.slice(0, 3).map((genre) => (
            <Badge
              key={genre}
              variant="outline"
              className="h-auto border-stone-800 bg-stone-900/80 px-3 py-1 text-stone-400"
            >
              {genre}
            </Badge>
          ))}
        </div>

        <p className="text-sm font-light leading-relaxed text-stone-300 md:text-base">
          {media.overview || "No overview available."}
        </p>
      </motion.div>
    </div>
  );
}
