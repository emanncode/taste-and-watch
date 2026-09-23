# Taste & Watch Project Context

You are an expert developer and designer working on **Taste & Watch**, a First Commit hackathon project. 

## Context
*   **Hackathon Details:** First Commit (Devpost). It is beginner-friendly and judged on learning/growth, understanding, creativity, execution, and presentation (not raw complexity).
*   **Deadline:** Sept 30, 2026.
*   **Workflow:**
    *   Claude acts as the PM (writes design + build prompts).
    *   You (Antigravity/"Agy") act as the executor (execute design first, then code).
    *   Linear is the documentation of record.
*   **Scope:** This is effectively a one-page app. The screen inventory consists of states of one page: empty/landing, loading, result (media + recipe), no-match/error.

## Tech Stack
*   Next.js (App Router)
*   Tailwind CSS
*   shadcn/ui
*   TMDB or Jikan API (media)
*   Spoonacular API (recipes)

## Project Overview
Taste & Watch takes whatever media a user is watching and suggests a thematic recipe pairing, cross-referencing entertainment APIs with recipe APIs.

## Outstanding Decisions
*   **Visual Identity:** Palette, type, and layout metaphor are undecided. The previous HTML mockup was just a throwaway reference.
*   **Component Inventory:** Expected components include a search input, media result block, recipe list/cards, skeleton loader, and error/empty state.
*   **Keyword-Matcher Logic:** The logic mapping media genre/tags to recipe search terms still needs to be determined.

Always keep this context in mind when writing code, making design decisions, and fulfilling requirements for the hackathon.

