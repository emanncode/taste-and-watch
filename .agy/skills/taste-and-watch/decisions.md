# Taste & Watch — Engineering Decisions

This file records meaningful implementation decisions that future agents should know before changing the system.

## Decision log

### 2026-09-24 — Initial Architecture Decisions

**Context**
Need a clear set of bounds for hackathon MVP development.

**Decision**
- TheMealDB is the recipe provider for the MVP.
- Spoonacular is not part of the MVP architecture.
- TMDB is the sole media provider for the MVP.
- Jikan is not part of the MVP architecture.
- Defer YouTube Data API to direct URL fallback if needed.
- Exclude user accounts, databases, and external backend architectures.
- Use simple service boundaries (`MediaService`, `RecommendationService`, `RecipeService`, `TutorialService`).

**Reason**
Simplifies MVP execution under hackathon constraints.

**Impact**
Future implementations should avoid bringing in complex external providers or databases without explicit scope changes.
