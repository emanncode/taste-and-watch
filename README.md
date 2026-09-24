# Taste & Watch

**Taste & Watch is an automated "movie night" planner.** It takes the media a user wants to watch and dynamically generates a menu of recipes that match the vibe, genre, or cultural origin of that specific movie or anime.

## The Value to Movie Lovers
Movie lovers already combine food and entertainment, but they face two massive friction points: decision fatigue ("What should we watch?" and "What should we eat?") and a disconnect between the two.

This project serves them by:
* **Elevating the Experience:** It turns a standard Tuesday night movie into a themed event. Watching Dune while eating a Middle-Eastern spiced dish, or Spirited Away with homemade Onigiri, makes the viewing experience immersive.
* **Eliminating Decision Fatigue:** Instead of scrolling Netflix and then separately scrolling UberEats or a recipe blog, the user makes one decision (the movie), and the app makes the second decision (the food) for them.

## Core Features (Hackathon MVP)
To finish by September 30, we are keeping the features highly focused:
* **Cinematic Search:** A rich, auto-completing search bar that queries the TMDB API.
* **The "Vibe" Matcher Engine:** The hidden logic that takes the movie's metadata and translates those into culinary search terms to query the Spoonacular Recipe API.
* **Immersive Pairing Dashboard:** A split-screen UI that displays the movie's high-res poster and synopsis next to 3-5 perfectly matched recipe cards.
* **Dynamic Theming:** The background of the web app subtly changes colors based on the dominant colors of the movie poster being searched.

## Application States (The User Journey)
1. **Idle State (The Landing):** Full-screen background, massive search bar. No data loaded yet.
2. **Loading State (The Fetch):** Pulsing "skeleton" loader appears while waiting for TMDB, Vibe Matcher, and Spoonacular.
3. **Success State (The Reveal):** Left side renders movie poster/details. Right side renders a scrollable deck of recipe cards. Clicking a recipe takes them to full instructions.
4. **Error / Empty State:** Friendly error messages for failed searches.

## Architecture & Folder Structure
* `src/app/page.tsx` (The main UI)
* `src/lib/api.ts` (Where we fetch from TMDB and Spoonacular)
* `src/lib/matcher.ts` (The "Vibe Matcher" logic that connects the two)

---

## Context
* Hackathon: First Commit (Devpost)
* Workflow: Claude = PM, Antigravity = Executor. Linear = documentation of record.
* Stack: Next.js (App Router), Tailwind CSS, shadcn/ui, TMDB API, Spoonacular API.

