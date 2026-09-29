# Taste & Watch

**Taste & Watch is an automated "movie night" planner.** It takes the media a user wants to watch and dynamically generates a menu of recipes that match the vibe, genre, or cultural origin of that specific movie or show.

## The Value to Movie Lovers

Movie lovers already combine food and entertainment, but they face two massive friction points: decision fatigue ("What should we watch?" and "What should we eat?") and a disconnect between the two.

This project serves them by:

- **Elevating the Experience:** It turns a standard Tuesday night movie into a themed event. Watching *Dune* while eating a Middle-Eastern spiced dish, or *Spirited Away* with homemade Onigiri, makes the viewing experience immersive.
- **Eliminating Decision Fatigue:** Instead of scrolling streaming services and then separately scrolling a recipe blog, the user makes one decision (the media), and the app suggests the second decision (the food) for them.

## Core Features (Hackathon MVP)

To finish by September 30, we have prioritized a highly focused and visually stunning MVP:

- **Cinematic Search & Discovery:** A rich, auto-completing search bar that queries TMDB. Features full pagination, dynamic type filtering (Movies vs TV), and sorting (Relevance, Newest, Oldest, Alphabetical) directly on the client side for instant refinement.
- **Intelligent Fuzzy Search:** If a movie title is misspelled or poorly remembered, the AI steps in to guess the intended title and automatically re-searches.
- **AI-Assisted Recommendations:** An AI-powered `RecommendationService` that interprets movie context to suggest thematic food pairings (e.g., "Atmospheric Match", "On-Screen Connection").
- **Immersive Pairing Dashboard:** A beautifully designed split-screen UI that utilizes the movie's high-res backdrop as an ambient, blurred environment, drawing the user into the mood of the film.
- **Full-Bleed Media Cards:** Movie and TV search results are displayed as premium, full-bleed posters with gradient overlays, elevated drop-shadows, and dynamic metadata (Release Year, Medium, Primary Genre).
- **Elegant Recipe Sheets:** Users can view recipe details in a massive, magazine-style split-screen sheet (or bottom sheet on mobile) containing high-res food imagery, ingredients, and prose-formatted instructions.
- **Tutorial Handoff:** A seamless transition from the recipe to YouTube video tutorials.

## Application States (The User Journey)

1. **Idle State (The Landing):** An elegant, minimalist landing page with a warm orange glow, highlighting a massive, inviting search bar.
2. **Search Results & Refinement:** Grid of elevated movie posters. Users can paginate, sort by date/title, or filter between Movies and TV Shows.
3. **Loading State (The Fetch):** Thematic, pulsing icons (Chef Hats, Utensils) appear while waiting for AI recommendations and recipes.
4. **Media Context & Reveal:** The movie's backdrop envelops the page. Left side renders media details. Right side renders a scrollable deck of AI-curated recipe recommendations.
5. **Recipe Modal:** A large, immersive modal displaying the chosen recipe, ingredients, and instructions.
6. **Tutorial Handoff:** A cinematic overlay mimicking a video player that directs the user to YouTube.

## MVP Architecture & Technical Decisions

- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons.
- **UI/UX Philosophy:** Relies purely on standard CSS utilities and native Tailwind configurations to achieve premium "glassmorphism", heavy drop-shadows, container gradients, and dynamic typography without requiring heavy component libraries. 
- **Providers:**
  - **TMDB:** Powers the media search, metadata mapping, and high-res imagery.
  - **TheMealDB:** Fetches structured recipe data, augmented by an AI-generated fallback when TheMealDB lacks matches.
  - **Vercel AI SDK:** Orchestrates the recommendation engine and fuzzy search using strictly typed JSON structured outputs (Zod). Supports multiple providers (Gemini 1.5 Flash, Groq, or NVIDIA NIM).
  - **YouTube Data API v3:** Provides the final "Tutorial Handoff" experience.
- **Architecture:**
  - **Single-Page State Machine:** The entire experience is a fluid single-page application governed by an explicit React state machine (`EMPTY` → `SEARCHING` → `SEARCH_RESULTS` → `MEDIA_SELECTED` → `RECOMMENDATIONS_READY` → `RECIPE_OPEN` → `TUTORIAL_HANDOFF`), eliminating jarring page loads.
  - **Server-Side Actions:** All API keys and provider integrations remain securely on the server within Next.js Server Actions.
  - **Graceful Fallbacks:** To ensure a bulletproof MVP, if the YouTube API quota is exceeded or the key is missing, the app seamlessly falls back to securely generating direct YouTube search URLs rather than breaking the movie-night flow.

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
   TMDB_API_KEY="your_tmdb_api_key_here"
   THEMEALDB_API_KEY="1"
   YOUTUBE_API_KEY="your_youtube_api_key_here" # Optional: Falls back to direct search URLs

   # Provide at least one of the following AI provider keys:
   AI_PROVIDER_API_KEY="your_google_ai_api_key_here"
   GROQ_API_KEY="your_groq_ai_api_key_here"
   NVIDIA_API_KEY="your_nvidia_ai_api_key_here"
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to start your movie night!

---

## Agent Context

For engineering agent instructions, refer to `AGENTS.md`.
