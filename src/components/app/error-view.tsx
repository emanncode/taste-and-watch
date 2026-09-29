"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_OUT, fadeUp, scaleIn, staggerContainer } from "@/lib/motion";

type ErrorViewProps = {
  message: string | null;
  action: { label: string; onClick: () => void };
};

export function ErrorView({ message, action }: ErrorViewProps) {
  return (
    <motion.section
      key="error"
      className="mx-auto mt-20 flex max-w-md flex-1 flex-col items-center justify-center text-center"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={staggerContainer(0.08, 0)}
    >
      <motion.div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10"
        variants={scaleIn}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <Info className="h-8 w-8 text-red-500" />
      </motion.div>

      <motion.h3
        className="mb-3 text-2xl font-bold text-stone-100"
        variants={fadeUp}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        Something went wrong
      </motion.h3>

      <motion.p
        className="mb-8 text-lg leading-relaxed text-stone-400"
        variants={fadeUp}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        {message}
      </motion.p>

      <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: EASE_OUT }}>
        <Button
          size="lg"
          onClick={action.onClick}
          className="h-auto rounded-full bg-stone-800 px-6 py-3 font-semibold text-stone-100 hover:bg-stone-700"
        >
          {action.label}
        </Button>
      </motion.div>
    </motion.section>
  );
}
