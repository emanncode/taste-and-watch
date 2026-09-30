"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recommendation } from "@/lib/services/recommendation";
import { formatConnectionType } from "@/lib/app-state";
import { EASE_OUT, scaleIn } from "@/lib/motion";

type PairingCardProps = {
  recommendation: Recommendation;
  disabled: boolean;
  onViewRecipe: (rec: Recommendation) => void;
};

export function PairingCard({
  recommendation,
  disabled,
  onViewRecipe,
}: PairingCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      whileHover={{ y: -4 }}
    >
      <Card className="group h-full justify-between overflow-hidden border-stone-800/80 bg-stone-900/60 shadow-lg backdrop-blur-sm transition-colors duration-300 hover:border-orange-500/40 hover:bg-stone-900 hover:shadow-orange-900/10">
        <CardHeader className="md:gap-3 p-6 flex flex-col md:flex-row justify-between">
          <CardTitle className="text-xl font-bold leading-tight text-stone-100 transition-colors group-hover:text-orange-400 md:text-2xl">
            {recommendation.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col px-6 pb-6">
          <CardDescription className="mb-8 flex-1 font-light leading-relaxed text-stone-400 text-sm md:text-base">
            {recommendation.reason}
          </CardDescription>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-stone-400">
            <span className="flex items-center gap-1.5 rounded-lg border border-stone-800/50 bg-stone-950/50 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-stone-500" aria-hidden />
              {recommendation.prepTimeMinutes} min
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-stone-800/50 bg-stone-950/50 px-3 py-1.5">
              <ChefHat className="h-3.5 w-3.5 text-stone-500" aria-hidden />
              {recommendation.difficulty}
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-stone-800/50 bg-stone-950/50 px-3 py-1.5">
              {formatConnectionType(recommendation.connectionType)}
            </span>
          </div>

          <Button
            onClick={() => onViewRecipe(recommendation)}
            disabled={disabled}
            className="h-auto w-full justify-between rounded-xl bg-stone-100 py-3.5 font-bold text-stone-950 hover:bg-white disabled:bg-stone-100 disabled:text-stone-950 disabled:opacity-50 disabled:hover:bg-stone-100"
          >
            View Recipe
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
