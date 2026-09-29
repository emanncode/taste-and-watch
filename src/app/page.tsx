/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Search,
  Film,
  Tv,
  ChefHat,
  Clock,
  UtensilsCrossed,
  X,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  Info,
} from "lucide-react";
// import { Input } from "@/components/ui/input";
import {
  fuzzySearchMedia,
  getMediaDetails,
  MediaSearchResult,
  MediaDetails,
} from "@/lib/services/media";
import {
  generateRecommendations,
  Recommendation,
} from "@/lib/services/recommendation";
import { searchRecipe, RecipeDetails } from "@/lib/services/recipe";
import { searchTutorial, TutorialResult } from "@/lib/services/tutorial";

type AppState =
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

// ---------------------------------------------------------------------------
// MOTION SYSTEM
// ---------------------------------------------------------------------------

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const staggerContainer = (stagger: number, delayChildren: number) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export default function TasteAndWatchApp() {
  const [appState, setAppState] = useState<AppState>("EMPTY");
  const [query, setQuery] = useState("");
  const [mediaResults, setMediaResults] = useState<MediaSearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<
    "relevance" | "newest" | "oldest" | "title"
  >("relevance");
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

  const handleReset = () => {
    setQuery("");
    setMediaResults([]);
    setCurrentPage(1);
    setTotalPages(1);
    setFilterType("all");
    setSortBy("relevance");
    setSelectedMedia(null);
    setRecommendations([]);
    setSelectedRecipe(null);
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

  const formatConnectionType = (type: string) => {
    switch (type) {
      case "screen_associated":
        return "On-Screen Connection";
      case "thematic":
        return "Thematic Pairing";
      case "vibe":
        return "Atmospheric Match";
      default:
        return type;
    }
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

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const isMediaContextActive = [
    "MEDIA_SELECTED",
    "RECOMMENDATIONS_LOADING",
    "RECOMMENDATIONS_READY",
    "RECIPE_LOADING",
    "RECIPE_OPEN",
    "TUTORIAL_LOADING",
    "TUTORIAL_HANDOFF",
  ].includes(appState);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-stone-950 text-stone-50 font-sans selection:bg-orange-500/30 overflow-x-hidden">
        {/* -----------------------------------------------------------------------
          BACKGROUND BACKDROP FOR MEDIA CONTEXT
          ----------------------------------------------------------------------- */}
        {isMediaContextActive && selectedMedia && selectedMedia.backdropUrl && (
          <motion.div
            key="media-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <img
              src={selectedMedia.backdropUrl}
              alt="Backdrop"
              className="w-full h-full object-cover object-top opacity-50 mix-blend-luminosity blur-[2px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/80 to-stone-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent md:w-3/4" />
          </motion.div>
        )}

        {/* -----------------------------------------------------------------------
          GLOBAL NAVIGATION / SEARCH BAR (When not empty)
          ----------------------------------------------------------------------- */}
        <AnimatePresence>
          {appState !== "EMPTY" && (
            <motion.header
              key="app-header"
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="sticky top-0 z-40 w-full backdrop-blur-xl bg-stone-950/70 border-b border-stone-800/50"
            >
            <div className="px-[5%] mx-auto px-6 h-20 flex items-center justify-between gap-6">
              <button
                onClick={handleReset}
                className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm shrink-0"
              >
                <div className="bg-orange-500/10 p-2 rounded-full border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors flex items-center justify-center">
                  <UtensilsCrossed
                    className="w-5 h-5 md:w-6 md:h-6 text-orange-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h1 className="hidden sm:block text-xl md:text-2xl font-bold tracking-tight text-stone-100 transition-colors group-hover:text-orange-400">
                  Taste & Watch
                </h1>
              </button>
              <form
                onSubmit={handleSearch}
                className="relative w-full max-w-xs sm:max-w-sm md:max-w-md group"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search a movie or show..."
                  className="w-full bg-stone-900/50 border border-stone-800/80 hover:border-stone-700 focus:border-orange-500/50 text-stone-100 placeholder:text-stone-500 pl-11 pr-4 h-11 rounded-full text-sm outline-none transition-all shadow-sm focus:bg-stone-900"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </div>
            </motion.header>
          )}
        </AnimatePresence>

        <main className="relative z-10 w-full px-[5%] mx-auto px-6 pb-24 min-h-[calc(100vh-5rem)] flex flex-col">
          {/* -----------------------------------------------------------------------
            EMPTY / LANDING STATE
            ----------------------------------------------------------------------- */}
          {appState === "EMPTY" && (
            <motion.div
              key="landing"
              className="flex-1 flex flex-col items-center justify-center text-center"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer(0.14, 0.05)}
            >
              <motion.div
                className="mb-10 relative"
                variants={fadeUp}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              >
                <div className="absolute inset-0 blur-3xl bg-orange-500/10 rounded-full w-full h-full transform scale-150" />
                <UtensilsCrossed
                  className="w-16 h-16 mx-auto text-orange-500 mb-6 relative z-10"
                  strokeWidth={1.5}
                />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-stone-50 relative z-10 leading-tight">
                  Taste & Watch
                </h1>
                <p className="text-xl md:text-2xl text-stone-400 mt-4 max-w-2xl mx-auto font-light tracking-wide relative z-10">
                  What should I eat while watching this?
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSearch}
                className="w-full max-w-2xl relative group z-10"
                variants={fadeUp}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              >
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-500 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter a movie or TV show title..."
                  className="w-full bg-stone-900/60 backdrop-blur-sm border border-stone-800/80 hover:border-stone-700 text-stone-100 placeholder:text-stone-500 pl-16 pr-6 h-16 md:h-20 rounded-full text-lg md:text-xl outline-none transition-all shadow-2xl focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 focus:bg-stone-900"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </motion.form>
            </motion.div>
          )}

          {/* -----------------------------------------------------------------------
            LOADING STATES (Generic)
            ----------------------------------------------------------------------- */}
          <AnimatePresence mode="wait">
            {(appState === "SEARCHING" || appState === "MEDIA_LOADING") && (
              <motion.div
                key={`loading-${appState}`}
                className="flex-1 flex flex-col items-center justify-center mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-stone-400 text-lg tracking-wide">
                  {appState === "SEARCHING"
                    ? "Searching the cinematic archives..."
                    : "Loading title details..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* -----------------------------------------------------------------------
            SEARCH RESULTS
            ----------------------------------------------------------------------- */}
          {appState === "SEARCH_RESULTS" && (
            <motion.div
              key="search-results"
              className="pt-12"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer(0.05, 0)}
            >
              <motion.div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                variants={fadeUp}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <h2 className="text-2xl font-medium tracking-tight text-stone-200">
                  Search results for{" "}
                  <span className="text-white font-bold">
                    &quot;{query}&quot;
                  </span>
                </h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={filterType}
                    onChange={(e) =>
                      setFilterType(e.target.value as "all" | "movie" | "tv")
                    }
                    className="bg-stone-900/60 backdrop-blur-sm border border-stone-700/50 text-stone-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-auto appearance-none cursor-pointer hover:bg-stone-800 transition-colors"
                  >
                    <option value="all">All Types</option>
                    <option value="movie">Movies</option>
                    <option value="tv">TV Shows</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                        | "relevance"
                        | "newest"
                        | "oldest"
                        | "title",
                      )
                    }
                    className="bg-stone-900/60 backdrop-blur-sm border border-stone-700/50 text-stone-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-auto appearance-none cursor-pointer hover:bg-stone-800 transition-colors"
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="newest">Sort: Newest</option>
                    <option value="oldest">Sort: Oldest</option>
                    <option value="title">Sort: Title (A-Z)</option>
                  </select>
                </div>
              </motion.div>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
                variants={staggerContainer(0.045, 0.12)}
              >
                {processedResults.length === 0 ? (
                  <motion.div
                    className="col-span-full py-12 text-center text-stone-500"
                    variants={fadeIn}
                  >
                    No results match your filters.
                  </motion.div>
                ) : processedResults.map((media) => (
                  <motion.button
                    key={media.id}
                    onClick={() => selectMedia(media)}
                    variants={fadeUp}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    className="group text-left flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl bg-stone-900/40 border border-stone-700/50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.08)] hover:-translate-y-1 transition-shadow duration-300 overflow-hidden relative aspect-[2/3] w-full"
                  >
                    <div className="absolute inset-0 bg-stone-950">
                      {media.posterUrl ? (
                        <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-600 bg-stone-900/50">
                          {media.mediaType === "movie" ? <Film className="w-10 h-10 mb-3" strokeWidth={1} /> : <Tv className="w-10 h-10 mb-3" strokeWidth={1} />}
                          <span className="text-xs uppercase tracking-widest font-medium">No Poster</span>
                        </div>
                      )}
                    </div>

                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent opacity-90 transition-opacity duration-300" />

                    {/* Content at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex flex-col justify-end z-10">
                      <h3 className={`font-bold text-stone-50 leading-tight group-hover:text-orange-400 transition-colors drop-shadow-lg mb-2.5 ${media.title.length > 20 ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} [text-wrap:balance]`}>
                        {media.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] md:text-xs font-bold text-stone-300 uppercase tracking-widest drop-shadow-md">
                        <span>{media.releaseYear || "N/A"}</span>
                        <span className="text-stone-500">•</span>
                        <span>{media.mediaType === "movie" ? "Movie" : "TV"}</span>
                        {media.primaryGenre && (
                          <>
                            <span className="text-stone-500">•</span>
                            <span className="text-orange-400/90 truncate max-w-[80px] sm:max-w-[100px]">{media.primaryGenre}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <motion.div
                  className="mt-12 flex items-center justify-center gap-4"
                  variants={fadeUp}
                >
                  <button
                    onClick={() => loadPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-5 py-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 disabled:opacity-50 disabled:hover:bg-stone-900/80 text-stone-200 text-sm font-semibold transition-colors border border-stone-800/80"
                  >
                    Previous
                  </button>
                  <span className="text-stone-400 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => loadPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-5 py-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 disabled:opacity-50 disabled:hover:bg-stone-900/80 text-stone-200 text-sm font-semibold transition-colors border border-stone-800/80"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* -----------------------------------------------------------------------
            MEDIA CONTEXT (Selected Movie + Recommendations)
            ----------------------------------------------------------------------- */}
          {isMediaContextActive && selectedMedia && (
            <motion.div
              key="media-context"
              className="pt-6 md:pt-8"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer(0.08, 0)}
            >
              <motion.button
                onClick={handleBackToResults}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-stone-400 hover:text-orange-400 transition-colors px-3 py-2 -ml-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ArrowLeft
                  className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                  strokeWidth={2}
                />
                Back to results
              </motion.button>

              <div className="pt-6 md:pt-10 flex flex-col md:flex-row gap-10 lg:gap-16">
                {/* LEFT COLUMN: Media Info */}
                <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 flex flex-col">
                  <motion.div
                    className="aspect-[2/3] w-[180px] md:w-full mx-auto md:mx-0 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/50 shadow-2xl relative mb-8"
                    variants={scaleIn}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                  >
                    {selectedMedia.posterUrl ? (
                      <img
                        src={selectedMedia.posterUrl}
                        alt={selectedMedia.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600 bg-stone-900/50">
                        <span className="text-sm uppercase tracking-widest">
                          No Poster
                        </span>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    className="text-center md:text-left space-y-6"
                    variants={fadeUp}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 }}
                  >
                    <div>
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                        {selectedMedia.title}
                      </h2>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm mb-6">
                        <span className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full font-medium border border-orange-500/20">
                          {selectedMedia.releaseYear || "Unknown Year"}
                        </span>
                        {selectedMedia.genres.slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            className="bg-stone-900/80 text-stone-400 px-3 py-1 rounded-full border border-stone-800"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      <p className="text-stone-300 leading-relaxed text-sm md:text-base font-light">
                        {selectedMedia.overview || "No overview available."}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* RIGHT COLUMN: The Pairings / Interaction Area */}
                <div className="flex-1 flex flex-col min-w-0 pb-12">
                  <AnimatePresence mode="wait">
                    {appState === "MEDIA_SELECTED" && (
                      <motion.div
                        key="cta"
                        className="flex-1 flex flex-col items-center justify-center text-center py-20 md:py-32 border-2 border-dashed border-stone-800 rounded-3xl bg-stone-900/20"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={staggerContainer(0.1, 0)}
                      >
                        <motion.div
                          variants={scaleIn}
                          transition={{ duration: 0.6, ease: EASE_OUT }}
                        >
                          <ChefHat
                            className="w-16 h-16 text-stone-700 mb-6"
                            strokeWidth={1}
                          />
                        </motion.div>
                        <motion.h3
                          className="text-2xl font-medium text-stone-200 mb-3"
                          variants={fadeUp}
                          transition={{ duration: 0.5, ease: EASE_OUT }}
                        >
                          Ready to pair the perfect meal?
                        </motion.h3>
                        <motion.p
                          className="text-stone-500 mb-8 max-w-sm"
                          variants={fadeUp}
                          transition={{ duration: 0.5, ease: EASE_OUT }}
                        >
                          Our AI chefs will analyze the atmosphere, setting, and
                          themes of this title to suggest perfectly curated recipes.
                        </motion.p>
                        <motion.button
                          onClick={handleFindPairings}
                          variants={fadeUp}
                          transition={{ duration: 0.5, ease: EASE_OUT }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative inline-flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-[0_0_40px_-10px_rgba(234,88,12,0.4)] hover:shadow-[0_0_60px_-15px_rgba(234,88,12,0.6)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
                        >
                          <UtensilsCrossed className="w-5 h-5 transition-transform group-hover:rotate-12" />
                          Generate Recipe Pairings
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {appState === "RECOMMENDATIONS_LOADING" && (
                      <motion.div
                        key="pairings-loading"
                        className="flex-1 flex flex-col items-center justify-center text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative w-20 h-20 mb-8">
                          <div className="absolute inset-0 border-4 border-stone-800 rounded-full"></div>
                          <motion.div
                            className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1.1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 m-auto w-8 h-8 text-orange-500"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{
                              duration: 1.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <ChefHat
                              className="w-full h-full text-orange-500"
                              strokeWidth={1.5}
                            />
                          </motion.div>
                        </div>
                        <motion.h3
                          className="text-xl font-medium text-stone-200"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          Crafting the perfect menu...
                        </motion.h3>
                        <p className="text-stone-500 mt-3 text-sm">
                          Analyzing thematic elements and on-screen cuisine
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {(appState === "RECOMMENDATIONS_READY" ||
                      appState === "RECIPE_LOADING" ||
                      appState === "RECIPE_OPEN" ||
                      appState === "TUTORIAL_LOADING" ||
                      appState === "TUTORIAL_HANDOFF") &&
                      recommendations.length > 0 && (
                        <motion.div
                          key="pairings-ready"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={staggerContainer(0.08, 0)}
                        >
                          <motion.div
                            className="flex items-end justify-between mb-8 pb-4 border-b border-stone-800/60"
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: EASE_OUT }}
                          >
                            <div>
                              <h3 className="text-sm uppercase tracking-widest text-stone-400 font-semibold mb-2">
                                Curated Menu
                              </h3>
                              <h2 className="text-2xl md:text-3xl font-bold text-stone-100 flex items-center gap-3">
                                Recommended Pairings
                              </h2>
                            </div>
                          </motion.div>

                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={staggerContainer(0.09, 0.15)}
                          >
                            {recommendations.map((rec, i) => (
                              <motion.div
                                key={i}
                                variants={scaleIn}
                                transition={{ duration: 0.5, ease: EASE_OUT }}
                                whileHover={{ y: -4 }}
                                className="group flex flex-col bg-stone-900/60 backdrop-blur-sm border border-stone-800/80 rounded-2xl overflow-hidden hover:bg-stone-900 hover:border-orange-500/40 transition-colors duration-300 shadow-lg hover:shadow-orange-900/10"
                              >
                              <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4 gap-4">
                                  <h4 className="text-xl md:text-2xl font-bold text-stone-100 leading-tight group-hover:text-orange-400 transition-colors">
                                    {rec.name}
                                  </h4>
                                  <span className="flex-shrink-0 text-[10px] uppercase tracking-wider font-bold bg-stone-800/80 text-stone-300 px-2.5 py-1 rounded-md border border-stone-700/50">
                                    {formatConnectionType(rec.connectionType)}
                                  </span>
                                </div>

                                <p className="text-stone-400 text-sm md:text-base leading-relaxed mb-8 flex-1 font-light">
                                  {rec.reason}
                                </p>

                                <div className="flex items-center gap-4 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-6">
                                  <span className="flex items-center gap-1.5 bg-stone-950/50 px-3 py-1.5 rounded-lg border border-stone-800/50">
                                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                                    {rec.prepTimeMinutes} min
                                  </span>
                                  <span className="flex items-center gap-1.5 bg-stone-950/50 px-3 py-1.5 rounded-lg border border-stone-800/50">
                                    <ChefHat className="w-3.5 h-3.5 text-stone-500" />
                                    {rec.difficulty}
                                  </span>
                                </div>

                                <motion.button
                                  onClick={() => handleFetchRecipe(rec)}
                                  disabled={appState !== "RECOMMENDATIONS_READY"}
                                  whileTap={{ scale: 0.98 }}
                                  className="w-full flex items-center justify-between bg-stone-100 hover:bg-white disabled:opacity-50 disabled:hover:bg-stone-100 text-stone-950 font-bold py-3.5 px-5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
                                >
                                <span>View Recipe</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                </div>
            </motion.div>
          )}

          {/* -----------------------------------------------------------------------
            ERROR STATE
            ----------------------------------------------------------------------- */}
          {appState === "ERROR" && (
            <motion.div
              key="error"
              className="flex-1 flex flex-col items-center justify-center text-center mt-20 max-w-md mx-auto"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer(0.08, 0)}
            >
              <motion.div
                className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6"
                variants={scaleIn}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <Info className="w-8 h-8 text-red-500" />
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-stone-100 mb-3"
                variants={fadeUp}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                Something went wrong
              </motion.h3>
              <motion.p
                className="text-stone-400 text-lg leading-relaxed mb-8"
                variants={fadeUp}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                {error}
              </motion.p>

              {selectedMedia && recommendations.length > 0 ? (
                <motion.button
                  onClick={() => setAppState("RECOMMENDATIONS_READY")}
                  variants={fadeUp}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Return to Recommendations
                </motion.button>
              ) : selectedMedia ? (
                <motion.button
                  onClick={() => setAppState("MEDIA_SELECTED")}
                  variants={fadeUp}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Return to Movie Details
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleReset}
                  variants={fadeUp}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Go to Home
                </motion.button>
              )}
            </motion.div>
          )}
        </main>

        {/* -----------------------------------------------------------------------
          RECIPE MODAL (Full-screen sheet style)
          ----------------------------------------------------------------------- */}
        <AnimatePresence>
          {appState === "RECIPE_OPEN" && selectedRecipe && (
            <motion.div
              key="recipe-modal"
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/80 backdrop-blur-md sm:p-6 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                className="w-full sm:max-w-5xl bg-stone-950 sm:border sm:border-stone-800 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[95vh] sm:h-[85vh] relative"
                initial={{ y: 60, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 40, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
              {/* Close Button Floating */}
              <button
                onClick={closeRecipe}
                className="absolute top-4 right-4 z-50 p-2.5 bg-stone-900/80 backdrop-blur hover:bg-stone-800 text-stone-400 hover:text-white rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 shadow-lg"
                aria-label="Close Recipe"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
                {/* Recipe Hero Image (Left on Desktop, Top on Mobile) */}
                <div className="w-full lg:w-5/12 relative flex-shrink-0 h-[40vh] lg:h-full bg-stone-900">
                  {selectedRecipe.imageUrl ? (
                    <>
                      <img
                        src={selectedRecipe.imageUrl}
                        alt={selectedRecipe.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80 lg:hidden" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-stone-950 opacity-90 hidden lg:block" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed className="w-16 h-16 text-stone-800" />
                    </div>
                  )}

                  {/* Mobile Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 lg:hidden">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-orange-400">
                      {selectedRecipe.category}
                      {selectedRecipe.area && (
                        <span className="text-stone-500">•</span>
                      )}
                      {selectedRecipe.area}
                    </div>
                    <h3 className="text-3xl font-bold text-white leading-tight drop-shadow-md">
                      {selectedRecipe.name}
                    </h3>
                  </div>
                </div>

                {/* Recipe Content (Right on Desktop, Bottom on Mobile) */}
                <div className="w-full lg:w-7/12 flex flex-col h-full bg-stone-950 lg:overflow-y-auto custom-scrollbar">
                  <div className="p-6 md:p-10 lg:p-12 flex-1">
                    {/* Desktop Title */}
                    <div className="hidden lg:block mb-10">
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">
                        {selectedRecipe.category}
                        {selectedRecipe.area && (
                          <span className="text-stone-700">•</span>
                        )}
                        {selectedRecipe.area}
                      </div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-stone-100 leading-tight">
                        {selectedRecipe.name}
                      </h3>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-12">
                      {/* Ingredients */}
                      <div className="w-full xl:w-5/12 flex-shrink-0">
                        <h4 className="text-lg font-bold text-stone-100 mb-6 flex items-center gap-2 border-b border-stone-800 pb-4">
                          Ingredients
                        </h4>
                        <ul className="space-y-4">
                          {selectedRecipe.ingredients.map((ing, idx) => (
                            <li
                              key={idx}
                              className="flex justify-between items-baseline text-sm"
                            >
                              <span className="text-stone-300 font-medium capitalize pr-4">
                                {ing.ingredient}
                              </span>
                              <span className="text-stone-500 text-right shrink-0">
                                {ing.measure}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div className="w-full xl:w-7/12">
                        <h4 className="text-lg font-bold text-stone-100 mb-6 flex items-center gap-2 border-b border-stone-800 pb-4">
                          Instructions
                        </h4>
                        <div className="prose prose-invert prose-stone max-w-none prose-p:text-stone-400 prose-p:leading-relaxed prose-p:mb-6">
                          {selectedRecipe.instructions
                            .split("\n")
                            .filter((p) => p.trim() !== "")
                            .map((para, idx) => (
                              <p key={idx}>{para}</p>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Footer CTA */}
                  <div className="sticky bottom-0 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 p-6 md:px-10 flex flex-col sm:flex-row items-center gap-4 justify-between shrink-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {selectedRecipe.sourceUrl && (
                        <a
                          href={selectedRecipe.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-stone-300 px-5 py-3.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 border border-stone-800"
                        >
                          <ExternalLink className="w-4 h-4" /> Source
                        </a>
                      )}
                    </div>
                    <motion.button
                      onClick={handleFindTutorial}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-lg shadow-red-900/20"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Watch Video Tutorial
                    </motion.button>
                  </div>
                </div>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -----------------------------------------------------------------------
          TUTORIAL HANDOFF MODAL
          ----------------------------------------------------------------------- */}
        <AnimatePresence>
          {appState === "TUTORIAL_HANDOFF" && tutorialResult && (
            <motion.div
              key="tutorial-modal"
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative"
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
              <button
                onClick={() => setAppState("RECIPE_OPEN")}
                className="absolute top-4 right-4 z-10 p-2 bg-stone-950/50 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 backdrop-blur"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {tutorialResult.thumbnail ? (
                <div className="w-full aspect-video relative bg-stone-950">
                  <img
                    src={tutorialResult.thumbnail}
                    alt={tutorialResult.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group pointer-events-none">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50 group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-stone-950 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-stone-800" />
                </div>
              )}

              <div className="p-8 text-center">
                <h3 className="text-xl font-bold text-stone-100 mb-2 leading-tight">
                  {tutorialResult.title}
                </h3>
                {tutorialResult.channelTitle && (
                  <p className="text-stone-500 text-sm mb-8 font-medium">
                    by {tutorialResult.channelTitle}
                  </p>
                )}

                <a
                  href={tutorialResult.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 text-base font-bold bg-white hover:bg-stone-200 text-red-600 px-6 py-4 rounded-xl transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-lg"
                >
                  Watch on YouTube <ExternalLink className="w-4 h-4" />
                </a>

                {tutorialResult.provider === "youtube_api" &&
                  selectedRecommendation && (
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedRecommendation.youtubeQuery)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-sm text-stone-500 hover:text-stone-300 font-medium transition-colors border-b border-transparent hover:border-stone-500 pb-0.5"
                    >
                      View more results on YouTube
                    </a>
                  )}
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global styles for custom scrollbar within this page scope if needed */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #292524;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #44403c;
        }
        `,
          }}
        />
      </div>
    </MotionConfig>
  );
}
