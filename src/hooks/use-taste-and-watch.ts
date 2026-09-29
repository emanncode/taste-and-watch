"use client";

import { useMemo, useState } from "react";
import {
  fuzzySearchMedia,
  getMediaDetails,
  type MediaSearchResult,
  type MediaDetails,
} from "@/lib/services/media";
import {
  generateRecommendations,
  type Recommendation,
} from "@/lib/services/recommendation";
import { searchRecipe, type RecipeDetails } from "@/lib/services/recipe";
import { searchTutorial, type TutorialResult } from "@/lib/services/tutorial";
import type { AppState, MediaFilter, MediaSort } from "@/lib/app-state";

export function useTasteAndWatch() {
  const [appState, setAppState] = useState<AppState>("EMPTY");
  const [query, setQuery] = useState("");
  const [mediaResults, setMediaResults] = useState<MediaSearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<MediaFilter>("all");
  const [sortBy, setSortBy] = useState<MediaSort>("relevance");
  const [selectedMedia, setSelectedMedia] = useState<MediaDetails | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<Recommendation | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(
    null,
  );
  const [tutorialResult, setTutorialResult] = useState<TutorialResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setAppState("SEARCHING");
      setError(null);
      setFilterType("all");
      setSortBy("relevance");
      const res = await fuzzySearchMedia(query, 1);
      setMediaResults(res.results);
      setCurrentPage(res.page || 1);
      setTotalPages(res.totalPages || 1);
      if (res.results.length > 0) {
        setAppState("SEARCH_RESULTS");
      } else {
        setError(
          "We couldn't find anything matching that title. Please try another search.",
        );
        setAppState("ERROR");
      }
    } catch (err) {
      console.error(err);
      setError("Our search system encountered an issue. Please try again.");
      setAppState("ERROR");
    }
  };

  const selectMedia = async (mediaResult: MediaSearchResult) => {
    try {
      setAppState("MEDIA_LOADING");
      setError(null);
      const details = await getMediaDetails(
        mediaResult.id,
        mediaResult.mediaType,
      );
      setSelectedMedia(details);
      setAppState("MEDIA_SELECTED");
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve details for this title right now.");
      setAppState("ERROR");
    }
  };

  const handleFindPairings = async () => {
    if (!selectedMedia) return;
    try {
      setAppState("RECOMMENDATIONS_LOADING");
      setError(null);
      const res = await generateRecommendations(selectedMedia);
      setRecommendations(res.recommendations);
      setAppState("RECOMMENDATIONS_READY");
    } catch (err) {
      console.error(err);
      setError(
        "Our chefs couldn't generate pairings at this moment. Please try again.",
      );
      setAppState("ERROR");
    }
  };

  const handleFetchRecipe = async (rec: Recommendation) => {
    try {
      setSelectedRecommendation(rec);
      setAppState("RECIPE_LOADING");
      setError(null);
      const recipe = await searchRecipe(rec.recipeQuery);
      if (!recipe) {
        setError(`We couldn't find a detailed recipe for "${rec.name}".`);
        setAppState("ERROR");
        return;
      }
      setSelectedRecipe(recipe);
      setAppState("RECIPE_OPEN");
    } catch (err) {
      console.error(err);
      setError("There was a problem opening this recipe. Please try again.");
      setAppState("ERROR");
    }
  };

  const handleFindTutorial = async () => {
    if (!selectedRecommendation) return;
    try {
      setAppState("TUTORIAL_LOADING");
      setError(null);
      const result = await searchTutorial(selectedRecommendation.youtubeQuery);
      setTutorialResult(result);
      setAppState("TUTORIAL_HANDOFF");
    } catch (err) {
      console.error(err);
      setError("Could not find a video tutorial right now. Please try again.");
      setAppState("ERROR");
    }
  };

  const closeRecipe = () => {
    setSelectedRecipe(null);
    setAppState("RECOMMENDATIONS_READY");
  };

  const closeTutorial = () => {
    setTutorialResult(null);
    setAppState("RECIPE_OPEN");
  };

  const handleReset = () => {
    setQuery("");
    setMediaResults([]);
    setCurrentPage(1);
    setTotalPages(1);
    setFilterType("all");
    setSortBy("relevance");
    setSelectedMedia(null);
    setRecommendations([]);
    setSelectedRecommendation(null);
    setSelectedRecipe(null);
    setTutorialResult(null);
    setError(null);
    setAppState("EMPTY");
  };

  const handleBackToResults = () => {
    if (mediaResults.length === 0) {
      handleReset();
      return;
    }
    setSelectedMedia(null);
    setRecommendations([]);
    setSelectedRecommendation(null);
    setSelectedRecipe(null);
    setTutorialResult(null);
    setError(null);
    setAppState("SEARCH_RESULTS");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadPage = async (page: number) => {
    try {
      setAppState("SEARCHING");
      window.scrollTo({ top: 0, behavior: "smooth" });
      const res = await fuzzySearchMedia(query, page);
      setMediaResults(res.results);
      setCurrentPage(res.page || page);
      setTotalPages(res.totalPages || 1);
      setAppState("SEARCH_RESULTS");
    } catch (err) {
      console.error(err);
      setError("Failed to load page.");
      setAppState("ERROR");
    }
  };

  const recoverToRecommendations = () => {
    setError(null);
    setAppState("RECOMMENDATIONS_READY");
  };

  const recoverToMedia = () => {
    setError(null);
    setAppState("MEDIA_SELECTED");
  };

  const processedResults = useMemo(() => {
    let res = [...mediaResults];
    if (filterType !== "all") {
      res = res.filter((m) => m.mediaType === filterType);
    }
    if (sortBy === "newest") {
      res.sort((a, b) =>
        (b.releaseYear || "0").localeCompare(a.releaseYear || "0"),
      );
    } else if (sortBy === "oldest") {
      res.sort((a, b) =>
        (a.releaseYear || "9999").localeCompare(b.releaseYear || "9999"),
      );
    } else if (sortBy === "title") {
      res.sort((a, b) => a.title.localeCompare(b.title));
    }
    return res;
  }, [mediaResults, filterType, sortBy]);

  return {
    appState,
    query,
    setQuery,
    mediaResults: processedResults,
    currentPage,
    totalPages,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    selectedMedia,
    recommendations,
    selectedRecommendation,
    selectedRecipe,
    tutorialResult,
    error,
    handleSearch,
    selectMedia,
    handleFindPairings,
    handleFetchRecipe,
    handleFindTutorial,
    closeRecipe,
    closeTutorial,
    handleReset,
    handleBackToResults,
    loadPage,
    recoverToRecommendations,
    recoverToMedia,
  };
}

export type TasteAndWatchController = ReturnType<typeof useTasteAndWatch>;
