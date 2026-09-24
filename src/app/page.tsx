"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Utensils, Clock, Film, X, CheckCircle2 } from "lucide-react";
import { searchMoviesList, fetchRecipePairing } from "@/lib/api";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isPairing, setIsPairing] = useState(false);

  // New state for Step 1 (Movie list)
  const [movieResults, setMovieResults] = useState<any[]>([]);

  // State for Step 2 (Final paired data)
  const [pairedData, setPairedData] = useState<any>(null);

  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  // STEP 1: Search for movies
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError("");
    setPairedData(null);
    setMovieResults([]);

    const results = await searchMoviesList(query);

    if (results.length === 0) {
      setError("We couldn't find any movies matching that title.");
    } else {
      setMovieResults(results);
    }

    setIsSearching(false);
  };

  // STEP 2: Select a movie and get recipes
  const handleSelectMovie = async (movie: any) => {
    setIsPairing(true);
    setMovieResults([]); // Clear the list so the UI transitions
    setError("");

    const result = await fetchRecipePairing(movie);

    if (!result) {
      setError("Failed to generate a pairing for this movie.");
    } else {
      setPairedData(result);
    }

    setIsPairing(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950"></div>

      <main className="relative z-10 container mx-auto px-6 py-12 max-w-6xl flex flex-col items-center">

        {/* Header & Search */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl text-center mt-12 mb-16"
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3 cursor-pointer" onClick={() => { setPairedData(null); setMovieResults([]); setQuery(""); }}>
            <Film className="w-10 h-10 text-emerald-400" />
            Taste & Watch
          </h1>
          <p className="text-zinc-400 text-lg mb-8">
            Enter a movie or anime. We'll curate the perfect themed menu.
          </p>

          <form onSubmit={handleSearch} className="relative flex items-center w-full">
            <div className="absolute left-4 text-zinc-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Spirited Away, The Matrix, Shrek..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-4 pl-12 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-zinc-600 backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={isSearching || isPairing}
              className="absolute right-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
          {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        </motion.div>

        {/* STEP 1: Movie Selection Grid */}
        <AnimatePresence>
          {movieResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Which one did you mean?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {movieResults.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    className="group flex flex-col items-center text-left transition-transform hover:scale-105 focus:outline-none"
                  >
                    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 group-hover:border-emerald-500 bg-zinc-900 mb-3 shadow-lg relative">
                      <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.jpg'}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-zinc-950/80 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">Select</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm w-full truncate">{movie.title}</h3>
                    <p className="text-zinc-500 text-xs w-full">
                      {movie.release_date ? movie.release_date.split('-')[0] : 'Unknown Year'}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeleton for Step 2 */}
        {isPairing && (
          <div className="w-full grid md:grid-cols-12 gap-8 animate-pulse">
            <div className="md:col-span-4 h-[600px] bg-zinc-900 rounded-2xl"></div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-zinc-900 rounded-2xl"></div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: The Final Paired Results */}
        <AnimatePresence>
          {pairedData && !isPairing && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full grid md:grid-cols-12 gap-10"
            >
              {/* Left Column: Movie Data */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <img
                  src={pairedData.movie.posterUrl}
                  alt={pairedData.movie.title}
                  className="w-full rounded-2xl shadow-2xl border border-zinc-800 object-cover"
                />
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {pairedData.movie.title} <span className="text-zinc-500 text-xl font-normal">({pairedData.movie.releaseYear})</span>
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pairedData.movie.genres.map((genre: string) => (
                      <span key={genre} className="text-xs font-medium px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-md">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {pairedData.movie.overview}
                  </p>
                </div>
              </div>

              {/* Right Column: Recipe Cards */}
              <div className="md:col-span-8">
                <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <Utensils className="w-6 h-6 text-emerald-400" />
                    Thematic Pairings
                  </h3>
                  <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                    Keywords: {pairedData.matchedKeywords}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pairedData.recipes.map((recipe: any, i: number) => (
                    <motion.button
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col text-left"
                    >
                      <div className="h-48 overflow-hidden relative w-full bg-zinc-900 flex items-center justify-center">
                        {recipe.image ? (
                          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <Utensils className="w-12 h-12 text-zinc-700" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow justify-between w-full">
                        <h4 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                          {recipe.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-zinc-400 mt-auto w-full">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {recipe.readyInMinutes} mins
                          </span>
                          <span className="text-emerald-500 font-medium group-hover:underline">
                            Read Recipe
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}

                  {/* Empty State for Recipes */}
                  {pairedData.recipes.length === 0 && (
                    <div className="col-span-1 sm:col-span-2 py-16 flex flex-col items-center justify-center text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                      <span className="text-4xl mb-4">🍿</span>
                      <h4 className="text-xl font-bold text-zinc-300 mb-2">No exact match found</h4>
                      <p className="text-zinc-500 text-sm max-w-md">Our algorithm couldn't find a perfect culinary pairing for this specific genre mix. Time to grab some classic popcorn!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IN-APP RECIPE MODAL (Unchanged from before) */}
        <AnimatePresence>
          {selectedRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
              onClick={() => setSelectedRecipe(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
              >
                <div className="relative h-64 w-full bg-zinc-950">
                  <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                  <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 bg-zinc-950/50 hover:bg-zinc-900 text-white p-2 rounded-full backdrop-blur-md transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-6 pr-6">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedRecipe.title}</h2>
                    <span className="flex items-center gap-1.5 text-zinc-300 text-sm font-medium">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {selectedRecipe.readyInMinutes} minutes to prepare
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">Ingredients</h3>
                    <ul className="space-y-3">
                      {selectedRecipe.extendedIngredients?.map((ingredient: any, idx: number) => (
                        <li key={idx} className="text-zinc-300 text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{ingredient.original}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">Instructions</h3>
                    {selectedRecipe.analyzedInstructions?.[0]?.steps?.length > 0 ? (
                      <ol className="space-y-4">
                        {selectedRecipe.analyzedInstructions[0].steps.map((step: any, idx: number) => (
                          <li key={idx} className="flex gap-4">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                              {step.number}
                            </span>
                            <p className="text-zinc-300 text-sm leading-relaxed mt-0.5">{step.step}</p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-zinc-400 italic text-sm">Detailed instructions were not provided by the source. But you can probably wing it based on the ingredients!</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}