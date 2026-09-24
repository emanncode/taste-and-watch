# Taste & Watch: The Journey So Far

This document chronicles every decision, architecture shift, user addition, and UI/UX design choice made from the beginning of the "Taste & Watch" project up to its current state.

## 1. Project Genesis & Scope
* **The Goal:** Build an automated "movie night" planner for the *First Commit* hackathon (Deadline: Sept 30, 2026).
* **The Core Problem:** Eliminate the decision fatigue of figuring out what to watch and what to eat, while elevating the viewing experience through thematic pairings.
* **The Stack:** Next.js (App Router), Tailwind CSS, `shadcn/ui`, Framer Motion, TMDB API (Movies/Anime), and Spoonacular API (Recipes).
* **Strategic Shift:** We explicitly decided to **delay building an account/login system**. The priority is to build out the core "wow factor" (the matching engine and immersive UI) to win the hackathon, leaving auth as a final polish step if time permits.

## 2. Architecture & Documentation
* **Linear Integration:** We used a Python script to hit the Linear GraphQL API, extracting the original hackathon spec and subsequently syncing our finalized architectural blueprints back to Linear.
* **Agent Context:** Created `AGENTS.md` at the project root to ensure any AI agent jumping into the codebase instantly understands the hackathon context, tech stack, and design language.
* **The "Vibe Matcher" Architecture:** We initially attempted to shove all API fetching and matching logic into a server-side Next.js route (`src/app/api/match/route.ts`). 
* **Course Correction (User Led):** You correctly pointed out this violated the original spec. You took the wheel and perfectly extracted the logic into a clean, client-callable structure:
  * `src/lib/api.ts`: Handles the dual-fetch execution (TMDB first, then Spoonacular).
  * `src/lib/matcher.ts`: Houses the dictionary that maps TMDB genres (e.g., *Horror*, *Sci-Fi*) into Spoonacular food keywords (e.g., *bloody*, *neon*, *spooky*).

## 3. UI/UX Design Decisions
* **Application States:** We strictly defined 4 states for a single-page architecture:
  1. **Idle:** Full-screen search bar, waiting for input.
  2. **Loading:** Pulsing skeleton loaders while the dual-APIs fetch.
  3. **Success:** The split-screen reveal.
  4. **Error:** Friendly fallback screens.
* **Cinematic Aesthetics:** Moved away from flat colors. We implemented dynamic, dark cinematic radial gradients overlaid with a subtle "cube" pattern to make the app feel like a premium streaming service.
* **The Split-Screen Dashboard:** 
  * **Left Side:** Displays the high-res movie poster, release year, and synopsis.
  * **Right Side:** Displays a scrollable deck of **3 to 5 thematic recipe cards** (expanding from our initial attempt at just 1 card).
* **Interactive Recipe Modals:** To keep the recipe cards clean (acting as "teasers"), we implemented `shadcn/ui` Dialogs. Clicking a recipe card dims the background and pops open a modal containing the full ingredient list, prep times, and a button to search YouTube for tutorials.
* **Framer Motion Animations:** We added layout animations so the UI elegantly morphs from the centered search bar to the split-screen layout when data is loaded.

## 4. Technical Hurdles & Bug Fixes
* **Lucide-React:** The `Youtube` icon was removed from the standard library, so we pivoted to using the `PlayCircle` icon for the tutorial buttons.
* **Shadcn asChild Bug:** The base shadcn `Button` component lacked the `asChild` prop by default, causing a React render crash when wrapping an `<a>` tag. We bypassed this by applying `buttonVariants()` directly to the anchor tag.
* **Framer Motion Compatibility:** You installed the latest `framer-motion` (v13), which triggered a `Can't resolve 'motion-dom'` bug due to Next.js server-component issues. I stepped in and forcefully downgraded it to the stable `framer-motion@11` to fix the compilation.
* **Next.js `<Image>` Strictness:** You implemented `next/image`, which crashed the UI because it requires strict `width`/`height` props and domain whitelisting (`image.tmdb.org`). I swapped them back to standard HTML `<img>` tags for rapid MVP iteration.
* **The "Movie Not Found" Environment Trap:** You correctly moved your API keys to `.env.local` and prefixed them with `NEXT_PUBLIC_` for client-side access in `api.ts`. However, the running Next.js dev server cached the old environment state, passing `undefined` to TMDB. A simple server restart fixed this.

## 5. What's Next?
We now have a fully functioning matching engine, beautiful API integration, and a cinematic UI rendering multiple recipes! The core loop is built.

