/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Search, Film, Tv, ChefHat, Clock, UtensilsCrossed, X, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fuzzySearchMedia, searchMedia, getMediaDetails, MediaSearchResult, MediaDetails } from "@/lib/services/media";
import { generateRecommendations, Recommendation } from "@/lib/services/recommendation";
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

export default function TasteAndWatchApp() {
  const [appState, setAppState] = useState<AppState>("EMPTY");
  const [query, setQuery] = useState("");
  const [mediaResults, setMediaResults] = useState<MediaSearchResult[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaDetails | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(null);
  const [tutorialResult, setTutorialResult] = useState<TutorialResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setAppState("SEARCHING");
      setError(null);
      
      const results = await fuzzySearchMedia(query);
      setMediaResults(results);
      
      if (results.length > 0) {
        setAppState("SEARCH_RESULTS");
      } else {
        setError("We couldn't quite find that one in our cinematic archives. Could you try another title?");
        setAppState("ERROR");
      }
    } catch (err) {
      console.error(err);
      setError("Our search system had a little hiccup. Please try your search again in a moment.");
      setAppState("ERROR");
    }
  };

  const selectMedia = async (mediaResult: MediaSearchResult) => {
    try {
      setAppState("MEDIA_LOADING");
      setError(null);
      const details = await getMediaDetails(mediaResult.id, mediaResult.mediaType);
      setSelectedMedia(details);
      setAppState("MEDIA_SELECTED");
    } catch (err) {
      console.error(err);
      setError("We're having trouble retrieving the details for that title right now. Let's try another one.");
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
      setError("Our virtual chefs are completely overwhelmed in the kitchen right now! Please try generating pairings again in a moment.");
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
        // Fallback or explicit no-match state. We'll set an error, but let user go back.
        setError(`We scoured our cookbooks, but we couldn't find a perfect recipe for "${rec.name}" right now.`);
        setAppState("ERROR");
        return;
      }

      setSelectedRecipe(recipe);
      setAppState("RECIPE_OPEN");
    } catch (err) {
      console.error(err);
      setError("We dropped the recipe card! Please try opening it again.");
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
      setError("We couldn't connect to the tutorial kitchen right now. Please try again in a bit.");
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
    setSelectedMedia(null);
    setRecommendations([]);
    setSelectedRecipe(null);
    setError(null);
    setAppState("EMPTY");
  };

  const formatConnectionType = (type: string) => {
    switch (type) {
      case "screen_associated": return "Screen Associated";
      case "thematic": return "Thematic Match";
      case "vibe": return "Vibe Match";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans">
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* TOP SEARCH BAR */}
        {appState !== "EMPTY" && (
          <div className="absolute top-6 left-6 right-6 md:left-12 md:right-12 z-20 flex items-center justify-between">
            <h2 onClick={handleReset} className="text-xl font-bold tracking-tight cursor-pointer hover:text-emerald-400 transition-colors hidden md:block">
              Taste & Watch
            </h2>
            <form onSubmit={handleSearch} className="relative group w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                <Search className="w-4 h-4" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="w-full bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 pl-10 h-10 rounded-full text-sm focus-visible:ring-emerald-500/50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>
        )}

        {/* EMPTY STATE */}
        {appState === "EMPTY" && (
          <div className="w-full max-w-2xl text-center space-y-8 mt-12 md:mt-0">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
              Taste & Watch
            </h1>
            <p className="text-lg text-zinc-400">
              What should I eat while watching this?
            </p>
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="What are you watching tonight?"
                className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 pl-12 h-14 rounded-full text-lg focus-visible:ring-emerald-500/50 transition-all shadow-xl border-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>
        )}

        {/* SEARCHING STATE */}
        {appState === "SEARCHING" && (
          <div className="w-full text-center py-20 text-zinc-400 mt-20">
            <p className="animate-pulse text-lg">Searching TMDB for &quot;{query}&quot;...</p>
          </div>
        )}

        {/* SEARCH_RESULTS STATE */}
        {appState === "SEARCH_RESULTS" && (
          <div className="w-full mt-24 md:mt-20">
            <h3 className="text-2xl font-bold mb-6 text-zinc-100">Results for &quot;{query}&quot;</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {mediaResults.map((media) => (
                <button 
                  key={media.id} 
                  type="button"
                  onClick={() => selectMedia(media)}
                  className="group cursor-pointer bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all hover:scale-105 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  <div className="aspect-[2/3] bg-zinc-900 relative">
                    {media.posterUrl ? (
                      <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                        {media.mediaType === "movie" ? <Film className="w-8 h-8 mb-2" /> : <Tv className="w-8 h-8 mb-2" />}
                        <span className="text-sm">No Poster</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-zinc-950/80 px-2 py-1 rounded text-xs text-zinc-300 font-medium border border-zinc-800 flex items-center gap-1.5 backdrop-blur-sm">
                      {media.mediaType === "movie" ? <Film className="w-3 h-3 text-emerald-400" /> : <Tv className="w-3 h-3 text-blue-400" />}
                      {media.mediaType === "movie" ? "Movie" : "TV"}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-zinc-100 truncate group-hover:text-emerald-400 transition-colors">
                      {media.title}
                    </h4>
                    <p className="text-sm text-zinc-500 mt-1">{media.releaseYear || "Unknown Year"}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MEDIA_LOADING STATE */}
        {appState === "MEDIA_LOADING" && (
          <div className="w-full text-center py-20 text-zinc-400 mt-20">
            <p className="animate-pulse text-lg">Loading details...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {appState === "ERROR" && (
          <div className="w-full text-center py-20 mt-20">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            {selectedMedia && recommendations.length > 0 ? (
              <button onClick={() => setAppState("RECOMMENDATIONS_READY")} className="text-emerald-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm px-2 py-1">
                Back to Recommendations
              </button>
            ) : selectedMedia ? (
              <button onClick={() => setAppState("MEDIA_SELECTED")} className="text-emerald-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm px-2 py-1">
                Back to Movie (Retry)
              </button>
            ) : (
              <button onClick={handleReset} className="text-emerald-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm px-2 py-1">
                Back to Home
              </button>
            )}
          </div>
        )}

        {/* MEDIA_SELECTED & LATER STATES (Keep Hero context alive) */}
        {(appState === "MEDIA_SELECTED" || appState === "RECOMMENDATIONS_LOADING" || appState === "RECOMMENDATIONS_READY" || appState === "RECIPE_LOADING" || appState === "RECIPE_OPEN" || appState === "TUTORIAL_LOADING" || appState === "TUTORIAL_HANDOFF") && selectedMedia && (
          <div className="w-full mt-24 md:mt-20">
            {appState === "MEDIA_SELECTED" && (
              <button 
                onClick={() => setAppState("SEARCH_RESULTS")} 
                className="text-emerald-400 hover:underline mb-6 block text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm px-2 py-1 -ml-2"
              >
                &larr; Back to results
              </button>
            )}
            
            <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
              {/* Media Poster */}
              <div className="w-full md:w-1/3 max-w-sm mx-auto md:mx-0 flex-shrink-0">
                <div className="aspect-[2/3] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl relative">
                  {selectedMedia.posterUrl ? (
                    <img
                      src={selectedMedia.posterUrl}
                      alt={selectedMedia.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                      {selectedMedia.mediaType === "movie" ? <Film className="w-12 h-12 mb-4 opacity-50" /> : <Tv className="w-12 h-12 mb-4 opacity-50" />}
                      <span>No Poster</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>
              </div>

              {/* Media Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="bg-zinc-800 px-3 py-1 rounded-full text-zinc-200 text-sm font-medium flex items-center gap-2 border border-zinc-700">
                      {selectedMedia.mediaType === "movie" ? <Film className="w-4 h-4 text-emerald-400" /> : <Tv className="w-4 h-4 text-blue-400" />}
                      {selectedMedia.mediaType === "movie" ? "Movie" : "TV Show"}
                    </span>
                    <span className="bg-zinc-800/50 px-2.5 py-1 rounded-md text-zinc-400 font-medium text-sm">
                      {selectedMedia.releaseYear || "Unknown Year"}
                    </span>
                    {selectedMedia.genres.map((genre) => (
                      <span key={genre} className="bg-zinc-800/30 px-2.5 py-1 rounded-md text-zinc-500 font-medium text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                    {selectedMedia.title}
                  </h2>
                  <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">
                    {selectedMedia.overview || "No overview available."}
                  </p>
                </div>
                
                {appState === "MEDIA_SELECTED" && (
                  <div className="pt-8 border-t border-zinc-800/50">
                    <button 
                      className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-3 rounded-full transition-colors shadow-lg shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                      onClick={handleFindPairings}
                    >
                      Find Recipe Pairings
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RECOMMENDATIONS SECTION */}
            {appState === "RECOMMENDATIONS_LOADING" && (
              <div className="w-full text-center py-20 text-zinc-400 border-t border-zinc-800/50">
                <ChefHat className="w-12 h-12 mx-auto mb-4 animate-bounce text-emerald-500" />
                <p className="animate-pulse text-lg">Our AI chef is brainstorming recipes for &quot;{selectedMedia.title}&quot;...</p>
              </div>
            )}

            {/* RECIPE LOADING STATE */}
            {appState === "RECIPE_LOADING" && (
              <div className="w-full text-center py-20 text-zinc-400 border-t border-zinc-800/50">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 animate-bounce text-emerald-500" />
                <p className="animate-pulse text-lg">Searching TheMealDB for the perfect recipe...</p>
              </div>
            )}

            {/* TUTORIAL LOADING STATE */}
            {appState === "TUTORIAL_LOADING" && (
              <div className="w-full text-center py-20 text-zinc-400 border-t border-zinc-800/50">
                <div className="w-12 h-12 mx-auto mb-4 animate-bounce text-red-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </div>
                <p className="animate-pulse text-lg">Finding the best video tutorial...</p>
              </div>
            )}

            {(appState === "RECOMMENDATIONS_READY" || appState === "RECIPE_OPEN") && (
              <div className="w-full border-t border-zinc-800/50 pt-12">
                <h3 className="text-3xl font-bold mb-8 text-zinc-100 flex items-center gap-3">
                  <UtensilsCrossed className="text-emerald-400" />
                  Recommended Pairings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex flex-col h-full hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-bold text-emerald-400 leading-tight">
                          {rec.name}
                        </h4>
                        <span className="text-xs font-medium bg-zinc-800 px-2 py-1 rounded text-zinc-300 whitespace-nowrap ml-3">
                          {formatConnectionType(rec.connectionType)}
                        </span>
                      </div>
                      
                      <p className="text-zinc-400 text-sm mb-6 flex-grow">
                        {rec.reason}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium mb-6 pt-4 border-t border-zinc-800/50">
                        <span className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded">
                          <Clock className="w-3.5 h-3.5" />
                          {rec.prepTimeMinutes} min
                        </span>
                        <span className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded capitalize">
                          <ChefHat className="w-3.5 h-3.5" />
                          {rec.difficulty}
                        </span>
                      </div>
                      
                      {appState === "RECOMMENDATIONS_READY" && (
                        <button 
                          onClick={() => handleFetchRecipe(rec)}
                          className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-2.5 rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                        >
                          Find Recipe
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RECIPE OVERLAY/MODAL */}
        {appState === "RECIPE_OPEN" && selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm overflow-y-auto">
            <div 
              role="dialog"
              aria-modal="true"
              aria-labelledby="recipe-modal-title"
              className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col mt-10 mb-10"
            >
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-zinc-900/95 backdrop-blur z-10 border-b border-zinc-800 p-6 flex items-center justify-between">
                <div>
                  <h3 id="recipe-modal-title" className="text-2xl font-bold text-zinc-50">{selectedRecipe.name}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400">
                    {selectedRecipe.category && <span>{selectedRecipe.category}</span>}
                    {selectedRecipe.area && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span>{selectedRecipe.area}</span>
                      </>
                    )}
                  </div>
                </div>
                <button 
                  onClick={closeRecipe}
                  aria-label="Close Recipe"
                  className="p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-10">
                
                {/* Left Col: Image & Ingredients */}
                <div className="w-full lg:w-1/3 space-y-8">
                  {selectedRecipe.imageUrl && (
                    <div className="aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img 
                        src={selectedRecipe.imageUrl} 
                        alt={selectedRecipe.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                      <ChefHat className="w-5 h-5" /> Ingredients
                    </h4>
                    <ul className="space-y-3">
                      {selectedRecipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex justify-between items-baseline border-b border-zinc-800/50 pb-2 text-sm">
                          <span className="text-zinc-200 capitalize">{ing.ingredient}</span>
                          <span className="text-zinc-500 text-right ml-4">{ing.measure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Col: Instructions */}
                <div className="w-full lg:w-2/3 space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-400 mb-4">Instructions</h4>
                    <div className="prose prose-invert prose-zinc max-w-none">
                      {selectedRecipe.instructions.split("\n").filter(p => p.trim() !== "").map((para, idx) => (
                        <p key={idx} className="mb-4 text-zinc-300 leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* External Links */}
                  <div className="pt-6 border-t border-zinc-800 flex flex-wrap gap-4">
                    {selectedRecipe.sourceUrl && (
                      <a 
                        href={selectedRecipe.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                      >
                        <ExternalLink className="w-4 h-4" /> Original Recipe Source
                      </a>
                    )}
                    <button 
                      onClick={handleFindTutorial}
                      className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                    >
                      Find Video Tutorial
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TUTORIAL HANDOFF OVERLAY/MODAL */}
        {appState === "TUTORIAL_HANDOFF" && tutorialResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm overflow-y-auto">
            <div 
              role="dialog"
              aria-modal="true"
              aria-labelledby="tutorial-modal-title"
              className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto flex flex-col mt-10 mb-10 text-center p-8 relative"
            >
              <button 
                onClick={() => setAppState("RECIPE_OPEN")}
                className="absolute top-6 right-6 p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 mx-auto mb-6 text-red-500 bg-red-500/10 rounded-full flex items-center justify-center">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </div>

              <h3 id="tutorial-modal-title" className="text-2xl font-bold text-zinc-50 mb-4">
                {tutorialResult.provider === "youtube_search" ? "Search YouTube for Tutorial" : "Tutorial Found!"}
              </h3>
              
              {tutorialResult.thumbnail && (
                <div className="w-full max-w-sm mx-auto aspect-video rounded-xl overflow-hidden border border-zinc-800 mb-6 bg-zinc-950">
                  <img 
                    src={tutorialResult.thumbnail} 
                    alt={tutorialResult.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              <p className="text-zinc-300 mb-2 font-medium">{tutorialResult.title}</p>
              {tutorialResult.channelTitle && (
                <p className="text-zinc-500 text-sm mb-8">by {tutorialResult.channelTitle}</p>
              )}

              <a 
                href={tutorialResult.url}
                target="_blank"
                rel="noreferrer"
                className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 text-lg bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-4 rounded-xl transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              >
                Watch on YouTube <ExternalLink className="w-5 h-5" />
              </a>

              {tutorialResult.provider === "youtube_api" && selectedRecommendation && (
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedRecommendation.youtubeQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-xl transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                >
                  More tutorials on YouTube <ExternalLink className="w-4 h-4" />
                </a>
              )}
              
              <button 
                onClick={() => setAppState("RECIPE_OPEN")}
                className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm px-2 py-1"
              >
                Back to Recipe
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}