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
import type { TutorialResult } from "@/lib/services/tutorial";

type TutorialDialogProps = {
  tutorial: TutorialResult | null;
  open: boolean;
  searchQuery?: string;
  onClose: () => void;
};

export function TutorialDialog({
  tutorial,
  open,
  searchQuery,
  onClose,
}: TutorialDialogProps) {
  if (!tutorial) return null;

  const showMoreResults =
    tutorial.provider === "youtube_api" && Boolean(searchQuery);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="flex max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden border-stone-800 bg-stone-900 p-0 text-stone-100 sm:max-w-lg">
        <DialogTitle className="sr-only">{tutorial.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Video tutorial handoff for {tutorial.title}.
        </DialogDescription>

        <div className="relative aspect-video w-full bg-stone-950">
          {tutorial.thumbnail ? (
            <>
              <img
                src={tutorial.thumbnail}
                alt={tutorial.title}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl shadow-red-900/50">
                  <PlayCircle className="ml-1 h-8 w-8 fill-current text-white" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PlayCircle className="h-16 w-16 text-stone-800" />
            </div>
          )}
        </div>

        <div className="p-8 text-center">
          <h3 className="mb-2 text-xl font-bold leading-tight text-stone-100">
            {tutorial.title}
          </h3>
          {tutorial.channelTitle && (
            <p className="mb-8 text-sm font-medium text-stone-500">
              by {tutorial.channelTitle}
            </p>
          )}

          <Button
            nativeButton={false}
            render={<a href={tutorial.url} target="_blank" rel="noreferrer" />}
            className="mb-4 h-auto w-full gap-2 rounded-xl bg-white px-6 py-4 text-base font-bold text-red-600 shadow-lg hover:bg-stone-200"
          >
            Watch on YouTube
            <ExternalLink className="size-4" />
          </Button>

          {showMoreResults && (
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery ?? "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block border-b border-transparent pb-0.5 text-sm font-medium text-stone-500 transition-colors hover:border-stone-500 hover:text-stone-300"
            >
              View more results on YouTube
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
