---
name: Taste & Watch Workflow
description: Project-specific engineering workflow and architecture guidelines for Taste & Watch
---

# PRODUCT CONTEXT

## Product

**Taste & Watch**

Core question:
> "What should I eat while watching this?"

The user searches for a movie or TV show and receives food recommendations that pair well with the viewing experience.

The product flow is:
Landing/Search → Search Movie/TV → Select Media → Movie Context → Food Recommendations → Why This Food? → Select Food → Recipe → YouTube Tutorial → Movie Night

The product is NOT primarily about identifying food that literally appears in movies.

Recommendations may be:
1. `screen_associated`
   * Food genuinely associated with the movie/show.
   * Must be supported by reliable evidence.
   * Never fabricate scenes, timestamps, characters eating a food, or cultural details.
2. `thematic`
   * Food connected to the setting, culture, era, themes, or subject matter of the media.
   * Must still be reasonable and explainable.
3. `vibe`
   * Food that fits the mood or viewing experience.
   * This is intentionally interpretive and should be presented as such.

The system must never invent movie facts simply to make a recommendation sound convincing.

---

# PRODUCT SCOPE

MVP includes:
* Movie/TV search
* Media selection
* Media context
* 3–5 food recommendations
* Explanation for each recommendation
* Recipe discovery
* YouTube cooking tutorial discovery
* Loading states
* Error/no-match states
* Responsive mobile/desktop experience

MVP does NOT include:
* Accounts/authentication
* Social features
* Reviews
* Grocery lists
* Pantry scanning
* Nutrition tracking
* Payments
* Native mobile apps
* User history
* Database-backed personalization
* Elaborate autonomous agent architecture

Do not introduce these unless the project scope is explicitly changed later.

---

# LOCKED TECHNICAL ARCHITECTURE

Use the following architecture unless a later project decision explicitly changes it:
* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui where useful
* Vercel AI SDK
* TMDB for movie/TV data
* TheMealDB for MVP recipe data
* YouTube Data API when configured
* Direct YouTube search URL fallback when YouTube API access is unavailable
* Next.js Route Handlers/server-side functions
* Server-side API keys
* No separate backend for MVP
* No database for MVP
* No Jikan for MVP
* No Spoonacular for MVP

The application should be structured around clear service boundaries such as:
* `MediaService`
* `RecommendationService`
* `RecipeService`
* `TutorialService`

Exact folder structure may follow the repository's existing conventions.
Do not create abstractions merely for the sake of abstraction.

---

# RECOMMENDATION CONTRACT

The recommendation engine should ultimately produce structured data equivalent to:

```ts
{
  recommendations: [
    {
      name: string
      connectionType: "screen_associated" | "thematic" | "vibe"
      reason: string
      prepTimeMinutes: number
      difficulty: "easy" | "medium" | "hard"
      recipeQuery: string
      youtubeQuery: string
    }
  ]
}
```

The AI may interpret and recommend.
The AI must NOT present unsupported movie facts as verified facts.
When evidence for a stronger connection is unavailable, the system should fall back toward thematic or vibe-based recommendations rather than fabricate evidence.

---

# ENGINEERING PRINCIPLES

These rules are important.

## 1. Inspect before modifying
Always understand the existing repository before making changes.
Do not rebuild working parts simply because another architecture seems preferable.

## 2. Incremental implementation
Each Linear issue is an implementation boundary.
Implement the current issue completely before moving into later issues.
Do not silently implement future issues.

## 3. Preserve established decisions
If an existing project document or implementation decision conflicts with a new idea, do not silently replace the established approach.
Identify the conflict and preserve the current project direction unless the project decision is explicitly changed.

## 4. Prefer simple architecture
This is a hackathon MVP.
Do not introduce:
* unnecessary microservices
* unnecessary databases
* unnecessary state-management libraries
* unnecessary agent frameworks
* unnecessary dependency layers
* speculative abstractions
* infrastructure that does not directly support the MVP

## 5. Keep provider integrations replaceable
External APIs should be accessed through clear service boundaries so they can be replaced without rewriting the UI.

## 6. Server-side secrets
API keys and secrets must never be exposed to the browser.
Use environment variables and server-side execution where appropriate.
Never commit real credentials.

## 7. Real data
The production path must use real provider data.
Do not hide unfinished integrations behind fake production data.
Mocks are acceptable for isolated development/testing when appropriate, but must not accidentally become the production path.

## 8. Graceful failure
External providers can fail.
The application should have sensible loading, empty, error, and fallback behavior rather than crashing.

## 9. Avoid premature polish
Do not spend an implementation issue redesigning unrelated parts of the application.
Complete the requested engineering work first.

## 10. Verify your work
Every implementation issue must finish with appropriate verification:
* lint
* type checking
* build
* relevant runtime/manual testing
* regression check of existing functionality
Use the repository's actual package manager and scripts rather than inventing commands.

---

# UX PRINCIPLES

The intended UX is cinematic + food-oriented, but restrained.

Primary search prompt:
> What are you watching tonight?

The main journey follows this state model:
`EMPTY` → `SEARCHING` → `MEDIA_SELECTED` → `RECOMMENDATIONS_LOADING` → `RECOMMENDATIONS_READY` → `RECIPE_OPEN` → `TUTORIAL_HANDOFF`

`ERROR` can occur from any relevant state.

The experience should feel like one coherent movie-night flow rather than a collection of unrelated pages.
Responsive behavior and accessibility matter.
Do not introduce visual complexity that does not improve the experience.

---

# ISSUE EXECUTION RULE

When given a Linear issue, interpret it as:
> "Implement this issue completely within the established Taste & Watch architecture, without expanding its scope."

Before coding:
1. Read this project skill.
2. Inspect the current repository.
3. Identify what already exists.
4. Determine the smallest correct implementation.
5. Implement only the requested issue.
6. Verify it.
7. Report what changed.

Do not ask the user to restate project context that is already contained in this skill.

---

# DEFINITION OF DONE

An issue is not considered complete merely because code was written.

Before declaring completion:
1. The requested functionality is implemented.
2. The implementation follows the established architecture.
3. Existing functionality has not unnecessarily been broken.
4. Type/lint/build checks pass where applicable.
5. Relevant runtime behavior has been tested.
6. No real secrets were committed.
7. No unnecessary dependencies or architecture were introduced.
8. The implementation does not silently implement later Linear issues.
9. Important new architectural decisions are recorded in `decisions.md`.

Final report format:
### Implemented
* ...
### Files changed
* ...
### Verification
* ...
### Decisions
* ...
### Limitations / follow-up
* ...
