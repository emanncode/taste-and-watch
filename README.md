# Taste & Watch

**Taste & Watch is an automated "movie night" planner.** It takes the media a user wants to watch and dynamically generates a menu of recipes that match the vibe, genre, or cultural origin of that specific movie or show.

## The Value to Movie Lovers
Movie lovers already combine food and entertainment, but they face two massive friction points: decision fatigue ("What should we watch?" and "What should we eat?") and a disconnect between the two.

This project serves them by:
* **Elevating the Experience:** It turns a standard Tuesday night movie into a themed event. Watching Dune while eating a Middle-Eastern spiced dish, or Spirited Away with homemade Onigiri, makes the viewing experience immersive.
* **Eliminating Decision Fatigue:** Instead of scrolling streaming services and then separately scrolling a recipe blog, the user makes one decision (the media), and the app suggests the second decision (the food) for them.

## Core Features (Hackathon MVP)
To finish by September 30, we are keeping the features highly focused:
* **Cinematic Search:** A rich, auto-completing search bar that queries TMDB.
* **AI-Assisted Recommendations:** An AI-powered `RecommendationService` that interprets movie context to suggest thematic food pairings and queries TheMealDB for matching recipes.
* **Immersive Pairing Dashboard:** A split-screen UI that displays the media's high-res poster and synopsis alongside a selection of thematic recipe cards.
* **Recipe & Tutorial Discovery:** Users can view recipe details and easily find related cooking tutorials.

## Application States (The User Journey)
1. **Idle State (The Landing):** Full-screen background, massive search bar. No data loaded yet.
2. **Loading State (The Fetch):** Pulsing "skeleton" loader appears while waiting for media, AI recommendations, and recipes.
3. **Success State (The Reveal):** Left side renders media details. Right side renders a scrollable deck of recipe recommendations. Clicking a recipe takes them to full instructions.
4. **Error / Empty State:** Friendly error messages for failed searches.

## MVP Architecture Highlights
* **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
* **Providers:** TMDB (Media), TheMealDB (Recipes), Vercel AI SDK (Recommendations).
* **Architecture:** Server-side API and provider access, organized by clear service boundaries (`MediaService`, `RecommendationService`, `RecipeService`, `TutorialService`).

---

## Agent Context
For engineering agent instructions, refer to `AGENTS.md`.
