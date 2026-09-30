/* eslint-disable @next/next/no-img-element */
"use client";

import { ExternalLink, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RecipeDetails } from "@/lib/services/recipe";
type RecipeDialogProps = {
  recipe: RecipeDetails | null;
  open: boolean;
  onClose: () => void;
  onFindTutorial: () => void;
};

export function RecipeDialog({
  recipe,
  open,
  onClose,
  onFindTutorial,
}: RecipeDialogProps) {
  if (!recipe) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="flex h-[95vh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden border-stone-800 bg-stone-950 p-0 text-stone-100 sm:h-[85vh] sm:max-w-5xl sm:rounded-3xl">
        <DialogTitle className="sr-only">{recipe.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Recipe details and ingredients for {recipe.name}.
        </DialogDescription>

        <div className="custom-scrollbar flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          <div className="relative h-[40vh] w-full flex-shrink-0 bg-stone-900 lg:h-full lg:w-5/12">
                          <>
                <img
                  src={recipe.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.name + " delicious food recipe high quality photography")}?width=800&height=1200&nologo=true`}
                  alt={recipe.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80 lg:hidden" />
                <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-stone-950 opacity-90 lg:block" />
              </>

            <div className="absolute bottom-6 left-6 right-6 lg:hidden">
              <RecipeEyebrow recipe={recipe} className="mb-2" />
              <h3 className="text-3xl font-bold leading-tight text-white drop-shadow-md">
                {recipe.name}
              </h3>
            </div>
          </div>

          <div className="custom-scrollbar flex h-full w-full flex-col bg-stone-950 lg:w-7/12 lg:overflow-y-auto">
            <div className="flex-1 p-6 md:p-10 lg:p-12">
              <div className="mb-10 hidden lg:block">
                <RecipeEyebrow recipe={recipe} className="mb-3" />
                <h3 className="text-4xl font-bold leading-tight text-stone-100 lg:text-5xl">
                  {recipe.name}
                </h3>
              </div>

              <div className="flex flex-col gap-12 xl:flex-row">
                <section className="w-full flex-shrink-0 xl:w-5/12">
                  <h4 className="mb-6 border-b border-stone-800 pb-4 text-lg font-bold text-stone-100">
                    Ingredients
                  </h4>
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ing, idx) => (
                      <li
                        key={`${ing.ingredient}-${idx}`}
                        className="flex items-baseline justify-between text-sm"
                      >
                        <span className="pr-4 font-medium capitalize text-stone-300">
                          {ing.ingredient}
                        </span>
                        <span className="shrink-0 text-right text-stone-500">
                          {ing.measure}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="w-full xl:w-7/12">
                  <h4 className="mb-6 border-b border-stone-800 pb-4 text-lg font-bold text-stone-100">
                    Instructions
                  </h4>
                  <div className="max-w-none space-y-6 text-sm leading-relaxed text-stone-400">
                    {recipe.instructions
                      .split("\n")
                      .filter((p) => p.trim() !== "")
                      .map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="sticky bottom-0 flex shrink-0 flex-col items-center justify-between gap-4 border-t border-stone-800 bg-stone-950/95 p-6 backdrop-blur-md md:px-10 sm:flex-row">
              <div className="flex w-full items-center gap-4 sm:w-auto">
                {recipe.sourceUrl && (
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                      <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    className="h-auto flex-1 gap-2 border-stone-800 px-5 py-3.5 text-sm font-semibold text-stone-300 hover:bg-stone-800 hover:text-stone-300 sm:flex-none"
                  >
                    <ExternalLink className="size-4" />
                    Source
                  </Button>
                )}
              </div>

              <Button
                onClick={onFindTutorial}
                className="h-auto w-full gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:bg-red-500 focus-visible:ring-red-500 sm:w-auto"
              >
                <PlayCircle className="size-5" />
                Watch Video Tutorial
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RecipeEyebrow({
  recipe,
  className,
}: {
  recipe: RecipeDetails;
  className?: string;
}) {
  if (!recipe.category && !recipe.area) return null;

  return (
    <div
      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400 ${className ?? ""}`}
    >
      {recipe.category}
      {recipe.area && (
        <>
          <span className="text-stone-700" aria-hidden>
            •
          </span>
          {recipe.area}
        </>
      )}
    </div>
  );
}
