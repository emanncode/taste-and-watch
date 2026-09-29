"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MediaInfoColumn } from "@/components/app/media-info-column";
import { PairingCta } from "@/components/app/pairing-cta";
import { PairingLoader } from "@/components/app/pairing-loader";
import { PairingCard } from "@/components/app/pairing-card";
import type { MediaDetails } from "@/lib/services/media";
import type { Recommendation } from "@/lib/services/recommendation";
import type { AppState } from "@/lib/app-state";
import { isRecommendationsState } from "@/lib/app-state";
import { EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";

type MediaContextViewProps = {
  state: AppState;
  media: MediaDetails;
  recommendations: Recommendation[];
  onBack: () => void;
  onFindPairings: () => void;
  onViewRecipe: (rec: Recommendation) => void;
};

export function MediaContextView({
  state,
  media,
  recommendations,
  onBack,
  onFindPairings,
  onViewRecipe,
}: MediaContextViewProps) {
  return (
    <motion.section
      key="media-context"
      className="pt-6 md:pt-8"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={staggerContainer(0.08, 0)}
    >
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.97 }}
        className="w-fit"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="-ml-3 h-auto gap-2 rounded-full px-3 py-2 text-sm font-semibold text-stone-400 hover:bg-transparent hover:text-orange-400"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={2}
          />
          Back to results
        </Button>
      </motion.div>

      <div className="flex flex-col gap-10 pt-6 md:flex-row md:pt-10 lg:gap-16">
        <MediaInfoColumn media={media} />

        <div className="flex min-w-0 flex-1 flex-col pb-12">
          <AnimatePresence mode="wait">
            {state === "MEDIA_SELECTED" && (
              <PairingCta key="cta" onFindPairings={onFindPairings} />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {state === "RECOMMENDATIONS_LOADING" && (
              <PairingLoader key="pairings-loading" />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isRecommendationsState(state) && recommendations.length > 0 && (
              <motion.div
                key="pairings-ready"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerContainer(0.08, 0)}
              >
                <div className="mb-8 pb-4">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-stone-400">
                    Curated Menu
                  </h3>
                  <h2 className="text-2xl font-bold text-stone-100 md:text-3xl">
                    Recommended Pairings
                  </h2>
                  <Separator className="mt-4 bg-stone-800/60" />
                </div>

                <motion.div
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                  variants={staggerContainer(0.09, 0.15)}
                >
                  {recommendations.map((rec) => (
                    <PairingCard
                      key={rec.name}
                      recommendation={rec}
                      disabled={state !== "RECOMMENDATIONS_READY"}
                      onViewRecipe={onViewRecipe}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
