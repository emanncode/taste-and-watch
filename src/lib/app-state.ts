export type AppState =
  | "EMPTY"
  | "SEARCHING"
  | "SEARCH_RESULTS"
  | "MEDIA_LOADING"
  | "MEDIA_SELECTED"
  | "RECOMMENDATIONS_LOADING"
  | "RECOMMENDATIONS_READY"
  | "RECIPE_LOADING"
  | "RECIPE_OPEN"
  | "TUTORIAL_LOADING"
  | "TUTORIAL_HANDOFF"
  | "ERROR";

export type MediaFilter = "all" | "movie" | "tv";

export type MediaSort = "relevance" | "newest" | "oldest" | "title";

const MEDIA_CONTEXT_STATES: readonly AppState[] = [
  "MEDIA_SELECTED",
  "RECOMMENDATIONS_LOADING",
  "RECOMMENDATIONS_READY",
  "RECIPE_LOADING",
  "RECIPE_OPEN",
  "TUTORIAL_LOADING",
  "TUTORIAL_HANDOFF",
];

export function isMediaContextState(state: AppState): boolean {
  return MEDIA_CONTEXT_STATES.includes(state);
}

export function isSearchState(state: AppState): boolean {
  return state === "SEARCHING" || state === "MEDIA_LOADING";
}

export function isRecommendationsState(state: AppState): boolean {
  return (
    state === "RECOMMENDATIONS_READY" ||
    state === "RECIPE_LOADING" ||
    state === "RECIPE_OPEN" ||
    state === "TUTORIAL_LOADING" ||
    state === "TUTORIAL_HANDOFF"
  );
}

const CONNECTION_TYPE_LABELS: Record<string, string> = {
  screen_associated: "On-Screen Connection",
  thematic: "Thematic Pairing",
  vibe: "Atmospheric Match",
};

export function formatConnectionType(type: string): string {
  return CONNECTION_TYPE_LABELS[type] ?? type;
}
