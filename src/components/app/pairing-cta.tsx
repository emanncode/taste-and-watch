"use client";

import { motion } from "framer-motion";
import { ChefHat, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_OUT, fadeUp, scaleIn, staggerContainer } from "@/lib/motion";

type PairingCtaProps = {
  onFindPairings: () => void;
};

export function PairingCta({ onFindPairings }: PairingCtaProps) {
  return (
    <motion.div
      key="cta"
      className="flex flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-800 bg-stone-900/20 py-20 text-center md:py-32"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={staggerContainer(0.1, 0)}
    >
      <motion.div variants={scaleIn} transition={{ duration: 0.6, ease: EASE_OUT }}>
        <ChefHat className="mb-6 h-16 w-16 text-stone-700" strokeWidth={1} />
      </motion.div>

      <motion.h3
        className="mb-3 text-2xl font-medium text-stone-200"
        variants={fadeUp}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        Ready to pair the perfect meal?
      </motion.h3>

      <motion.p
        className="mb-8 max-w-sm text-stone-500"
        variants={fadeUp}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        Our AI chefs will analyze the atmosphere, setting, and themes of this
        title to suggest perfectly curated recipes.
      </motion.p>

      <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: EASE_OUT }}>
        <Button
          size="lg"
          onClick={onFindPairings}
          className="group h-auto gap-3 rounded-full bg-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_40px_-10px_rgba(234,88,12,0.4)] hover:bg-orange-500 hover:shadow-[0_0_60px_-15px_rgba(234,88,12,0.6)] focus-visible:ring-orange-500/30"
        >
          <UtensilsCrossed className="size-5 transition-transform group-hover:rotate-12" />
          Generate Recipe Pairings
        </Button>
      </motion.div>
    </motion.div>
  );
}
