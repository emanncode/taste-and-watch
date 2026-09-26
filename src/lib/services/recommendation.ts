"use server";

import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { MediaDetails } from "./media";

import { createOpenAI } from "@ai-sdk/openai";

export interface Recommendation {
  name: string;
  connectionType: "screen_associated" | "thematic" | "vibe";
  reason: string;
  prepTimeMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  recipeQuery: string;
  youtubeQuery: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
}

const recommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string(),
      connectionType: z.enum(["screen_associated", "thematic", "vibe"]),
      reason: z.string(),
      prepTimeMinutes: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      recipeQuery: z.string(),
      youtubeQuery: z.string(),
    })
  ).min(3).max(5),
});

export async function generateRecommendations(
  media: MediaDetails
): Promise<RecommendationResponse> {
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.AI_PROVIDER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;

  if (!geminiKey && !groqKey && !nvidiaKey) {
    throw new Error("No AI Provider API key configured. Set GROQ_API_KEY, NVIDIA_API_KEY, or GOOGLE_GENERATIVE_AI_API_KEY.");
  }

  // WORKAROUND: Force IPv4 for the AI SDK to bypass the local IPv6 ETIMEDOUT bug
  const { fetch: undiciFetch, Agent: UndiciAgent } = await import("undici");
  const dns = await import("node:dns");
  
  const ipv4Agent = new UndiciAgent({
    connect: {
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { ...options, family: 4 }, callback);
      }
    }
  });

  const customFetch = (url: URL | RequestInfo, init?: RequestInit) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return undiciFetch(url as any, { ...init, dispatcher: ipv4Agent } as any) as unknown as Promise<Response>;
  };

  // Dynamically select the provider based on available keys
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let aiModel: any;
  
  if (groqKey) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqKey,
      fetch: customFetch
    });
    // Groq's GPT OSS 120B is incredibly fast and great at JSON
    aiModel = groq("openai/gpt-oss-120b");
  } else if (nvidiaKey) {
    const nvidia = createOpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: nvidiaKey,
      fetch: customFetch
    });
    // NVIDIA NIM Llama 3.1 70B
    aiModel = nvidia("meta/llama-3.1-70b-instruct");
  } else {
    const google = createGoogleGenerativeAI({ 
      apiKey: geminiKey,
      fetch: customFetch
    });
    aiModel = google("gemini-3.8-flash");
  }

  const prompt = `
    You are a culinary recommendation engine. The user is watching the following ${media.mediaType}:
    
    Title: ${media.title}
    Release Year: ${media.releaseYear || "Unknown"}
    Genres: ${media.genres.join(", ") || "None specified"}
    Overview: ${media.overview || "No overview available."}
    
    Recommend 3 to 5 food dishes that pair perfectly with this viewing experience.
    Answer the question: "What should I eat while watching this?"
    
    Rules for recommendations:
    1. Prefer specific, practical foods over generic answers (e.g. don't just say "popcorn").
    2. 'screen_associated': Use this ONLY when the supplied media context provides evidence for that association. NEVER fabricate movie scenes, food appearances, character meals, timestamps, cultural claims, or other unsupported facts.
    3. 'thematic': Use this for reasonable thematic, era, or cultural connections. Thematic and vibe recommendations must NOT masquerade as factual screen appearances.
    4. 'vibe': Use this for interpretive pairings based on the tone, genre, atmosphere, or viewing experience.
    5. The 'reason' must explain the recommendation without presenting unsupported facts as established facts.
    6. 'recipeQuery' and 'youtubeQuery' must be highly searchable, specific strings to find a recipe (e.g. "classic ratatouille recipe", "how to make ratatouille").
  `;

  try {
    const { object } = await generateObject({
      model: aiModel,
      schema: recommendationSchema,
      prompt: prompt,
      temperature: 0.7,
    });

    return object as RecommendationResponse;
  } catch (error) {
    console.error("Failed to generate AI recommendations:", error);
    throw new Error("Failed to generate recommendations. Please try again later.");
  }
}
