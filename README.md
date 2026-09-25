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

## MVP Architecture & Technical Decisions
* **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
* **Providers:** 
  * **TMDB:** Powers the media search and details.
  * **TheMealDB:** Fetches structured recipe data.
  * **Vercel AI SDK (Gemini 3.8 Flash):** Orchestrates the recommendation engine using strictly typed JSON structured outputs (Zod). We enforce a robust schema containing connection type, reasoning, prep time, difficulty, and smart search queries.
  * **YouTube Data API v3:** Provides the final "Tutorial Handoff" experience.
* **Architecture:** 
  * **Single-Page State Machine:** The entire experience is a fluid single-page application governed by an explicit state machine (`EMPTY` → `SEARCHING` → `MEDIA_SELECTED` → `RECOMMENDATIONS_READY` → `RECIPE_OPEN` → `TUTORIAL_HANDOFF`), eliminating jarring page loads.
  * **Server-Side Actions:** All API keys and provider integrations remain strictly on the server (`src/lib/services/*`).
  * **Graceful Fallbacks:** To ensure a bulletproof MVP, if the YouTube API quota is exceeded or the key is missing, the app seamlessly falls back to securely generating direct YouTube search URLs rather than breaking the movie-night flow.

## Running Locally

1. **Clone & Install**
   ```bash
   git clone https://github.com/emanncode/taste-and-watch.git
   cd taste-and-watch
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root based on `.env.example`:
   ```env
   TMDB_ACCESS_TOKEN="your_tmdb_read_access_token_here"
   GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key_here"
   YOUTUBE_API_KEY="your_youtube_data_api_v3_key_here" # Optional: App will safely fallback to direct search URLs if missing
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to start your movie night!

---

## Agent Context
For engineering agent instructions, refer to `AGENTS.md`.
