# Devpost — About the Project

Copy the section below into your [Devpost submission](https://devpost.com/Emann-Code-01) → **About the project**.

## 💡 The Inspiration
We've all been there: you sit down to start a new anime or movie, but you don't know what to eat. You end up scrolling endlessly on food delivery apps or settling for plain popcorn. I wanted to solve the "dinner and a movie" dilemma by turning it into an automated, thematic experience.

## ⚙️ What it does
**Taste & Watch** takes whatever media you are watching and dynamically suggests a customized, thematic recipe.
- If you search for an anime like *Naruto*, it curates authentic ramen recipes.
- If you search for a cyberpunk sci-fi movie, it suggests neon-themed mocktails or modern street food.

It cross-references entertainment databases with recipe APIs to generate the perfect pairing.

## 🛠️ How we built it
The frontend is built using **Next.js** and **Tailwind CSS**, utilizing **shadcn/ui** for clean, accessible components. To make the interface feel cinematic, I used **Framer Motion** for page transitions and micro-interactions.

The core logic orchestrates several APIs:
1. **The TMDB API:** Fetches the movie/anime details, genres, and high-quality poster artwork.
2. **The Vercel AI SDK:** The heart of the project. Using strictly typed **Zod** schemas and `generateObject`, the LLM reads the title, genres, and overview, then invents three *pairings* — each with a name, a prep time, a difficulty, a one-line reason it fits, and the exact search terms to use downstream. It is also used to rescue search: if TMDB returns nothing, the AI guesses the title the user actually meant.
3. **TheMealDB:** Serves the real recipe content — ingredients, measurements, and step-by-step instructions.
4. **The YouTube Data API:** Finds a tutorial for the winning dish and hands the user off to watch it.

The AI layer is provider-agnostic and will run on **Gemini**, **Groq**, or **NVIDIA NIM**, depending on which API key is configured.

## 🚧 Challenges I ran into
The biggest challenge was the data orchestration. Matching a movie title directly to a recipe doesn't work out of the box — a recipe database has no concept of *"the food that goes with a 1999 cyberpunk thriller."*

I had to build a "Keyword Matcher" system that asks the model to translate a title's genres and themes (e.g., "Horror" or "Slice of Life") into genuinely searchable culinary terms (e.g., "spooky, dark chocolate" or "comfort food, soup").

The second problem was that even a good keyword can miss. So every step degrades gracefully instead of failing: the search falls back to a cleaned-up query, a recipe miss falls back to a fully AI-generated recipe, and an expired YouTube key silently drops the tutorial button rather than breaking the flow.

## 🎓 Accomplishments that I'm proud of
I am extremely proud of the UI layer. By focusing on a clean layout and handling asynchronous API loading states gracefully, the app feels immersive and professional rather than just a basic data-fetcher.

I'm also proud that the pairings carry their reasoning. Each suggestion explains *why* it fits — the vibe, the theme, or a dish tied directly to a scene on screen — so it reads as a recommendation rather than a random search result.

## 📚 What I learned
This project was a deep dive into asynchronous API orchestration. Managing loading states and error boundaries while waiting on several sequential APIs was a massive learning experience for my frontend engineering skills.

On the AI side, I learned that the hard part isn't calling a model — it's constraining it. Validating every response against a Zod schema is what turns a chat completion into something a UI can actually render, and designing the schema first (what is a pairing, what is a recipe step) shaped the whole architecture.

## 🚀 What's next for Taste & Watch
In the future, I plan to add a "Pantry Mode," where users can input the ingredients they already have in their fridge, and the app will generate a movie-themed recipe using only those available items!

---

## Built With

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui on Base UI, Framer Motion |
| AI | Vercel AI SDK — `generateObject` + Zod (Gemini / Groq / NVIDIA NIM) |
| Data | TMDB API, TheMealDB, YouTube Data API |

---

## Author

**Ifeoluwa Olajubaje** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-emanncode-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/emanncode)
[![X](https://img.shields.io/badge/X-@emanncode-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/emanncode)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-emmanuel--olajubaje-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/emmanuel-olajubaje/)
[![Devpost](https://img.shields.io/badge/Devpost-Emann--Code--01-0A66C2?style=flat-square)](https://devpost.com/Emann-Code-01)
[![Portfolio](https://img.shields.io/badge/Portfolio-emanncode.work-FF6D00?style=flat-square)](https://emanncode.work)
[![Email](https://img.shields.io/badge/Email-Contact-EA580C?style=flat-square)](mailto:olajubajeifeoluwa93@gmail.com)
