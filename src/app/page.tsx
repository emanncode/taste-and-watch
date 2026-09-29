"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useTasteAndWatch } from "@/hooks/use-taste-and-watch";
import {
  isMediaContextState,
  isSearchState,
} from "@/lib/app-state";
import { AppHeader } from "@/components/app/app-header";
import { MediaBackdrop } from "@/components/app/media-backdrop";
import { LandingView } from "@/components/app/landing-view";
import { LoadingView } from "@/components/app/loading-view";
import { SearchResultsView } from "@/components/app/search-results-view";
import { MediaContextView } from "@/components/app/media-context-view";
import { ErrorView } from "@/components/app/error-view";
import { SiteFooter } from "@/components/app/site-footer";
import { RecipeDialog } from "@/components/app/recipe-dialog";
import { TutorialDialog } from "@/components/app/tutorial-dialog";

export default function TasteAndWatchApp() {
  const app = useTasteAndWatch();
  const {
    appState,
    query,
    setQuery,
    mediaResults,
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
  } = app;

  const showBackdrop = isMediaContextState(appState) && selectedMedia;

  const errorAction = (() => {
    if (selectedMedia && recommendations.length > 0) {
      return { label: "Return to Recommendations", onClick: recoverToRecommendations };
    }
    if (selectedMedia) {
      return { label: "Return to Movie Details", onClick: recoverToMedia };
    }
    return { label: "Go to Home", onClick: handleReset };
  })();

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-stone-950 font-sans text-stone-50 selection:bg-orange-500/30">
        {showBackdrop && selectedMedia.backdropUrl && (
          <MediaBackdrop backdropUrl={selectedMedia.backdropUrl} />
        )}

        <AppHeader
          visible={appState !== "EMPTY"}
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <main className="relative z-10 mx-auto flex w-full flex-1 flex-col px-[5%] pb-16">
          <AnimatePresence mode="wait">
            {appState === "EMPTY" && (
              <LandingView
                key="landing"
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearch}
              />
            )}

            {isSearchState(appState) && <LoadingView key="loading" state={appState} />}

            {appState === "SEARCH_RESULTS" && (
              <SearchResultsView
                key="search-results"
                query={query}
                results={mediaResults}
                currentPage={currentPage}
                totalPages={totalPages}
                filterType={filterType}
                sortBy={sortBy}
                onFilterChange={setFilterType}
                onSortChange={setSortBy}
                onSelect={selectMedia}
                onPageChange={loadPage}
              />
            )}

            {showBackdrop && selectedMedia && (
              <MediaContextView
                key="media-context"
                state={appState}
                media={selectedMedia}
                recommendations={recommendations}
                onBack={handleBackToResults}
                onFindPairings={handleFindPairings}
                onViewRecipe={handleFetchRecipe}
              />
            )}

            {appState === "ERROR" && (
              <ErrorView key="error" message={error} action={errorAction} />
            )}
          </AnimatePresence>
        </main>

        <SiteFooter />

        <RecipeDialog
          recipe={selectedRecipe}
          open={appState === "RECIPE_OPEN"}
          onClose={closeRecipe}
          onFindTutorial={handleFindTutorial}
        />

        <TutorialDialog
          tutorial={tutorialResult}
          open={appState === "TUTORIAL_HANDOFF"}
          searchQuery={selectedRecommendation?.youtubeQuery}
          onClose={closeTutorial}
        />
      </div>
    </MotionConfig>
  );
}
