# Taste & Watch — Agent Entry Point

Welcome to the **Taste & Watch** repository.

This project is a First Commit hackathon project.

## Project Documentation & Authority

To prevent conflicting historical instructions, follow this strict hierarchy of authority:

1. **Linear Documentation:** Current product requirements and scope live in Linear.
2. **`.agy/skills/taste-and-watch/SKILL.md`:** The authoritative AGY implementation instructions for this project. **Always refer to this file before making changes.**
3. **`.agy/skills/taste-and-watch/decisions.md`:** The authoritative record for locked technical and product decisions.
4. **`AGENTS.md` (this file):** Lightweight repository-level entry point.
5. **`PROJECT_JOURNEY.md`:** A purely historical record of previous decisions. **Do not use this as an implementation authority.**

## Repository Rules

*   **Consult the `.agy` files first:** All detailed architectural guidelines, definitions of done, and UX principles are located in `.agy/skills/taste-and-watch/SKILL.md`.
*   **Do not rely on stale specifications:** Earlier iterations of this project experimented with different APIs (e.g., Jikan, Spoonacular), client-side secrets, and varying visual directions. These are obsolete. Follow the locked architecture defined in the `.agy` decision and skill files.
*   **Use the issue template:** When executing tasks, ensure the prompt aligns with the structure provided in `.agy/skills/taste-and-watch/issue-template.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
