"use server";
import { ipv4Fetch } from "./fetch";

export interface MediaSearchResult {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  releaseYear: string | null;
  posterUrl: string | null;
}

export interface MediaDetails {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  releaseYear: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;
  genres: string[];
}

export async function searchMedia(query: string): Promise<MediaSearchResult[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  if (!query.trim()) {
    return [];
  }

  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`;

  const res = await ipv4Fetch(
    url,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`TMDB Search API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const results = data.results || [];

  return results
    .filter(
      (item: Record<string, unknown>) =>
        item.media_type === "movie" || item.media_type === "tv"
    )
    .map((item: Record<string, unknown>) => {
      const isMovie = item.media_type === "movie";
      const title = isMovie ? (item.title as string) : (item.name as string);
      const releaseDate = isMovie
        ? (item.release_date as string)
        : (item.first_air_date as string);
      const releaseYear = releaseDate ? releaseDate.split("-")[0] : null;

      return {
        id: item.id as number,
        title: title || "Unknown Title",
        mediaType: item.media_type as "movie" | "tv",
        releaseYear,
        posterUrl: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null,
      };
    });
}

export async function getMediaDetails(
  id: number,
  type: "movie" | "tv"
): Promise<MediaDetails> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  const res = await ipv4Fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`TMDB Details API Error: ${res.status} ${res.statusText}`);
  }

  const item = await res.json();
  const isMovie = type === "movie";
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const releaseYear = releaseDate ? releaseDate.split("-")[0] : null;
  const genres = item.genres ? item.genres.map((g: { name: string }) => g.name) : [];

  return {
    id: item.id,
    title: title || "Unknown Title",
    mediaType: type,
    releaseYear,
    posterUrl: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : null,
    backdropUrl: item.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
      : null,
    overview: item.overview || "",
    genres,
  };
}

import { generateObject } from "ai";
import { z } from "zod";
import { getAIModel } from "./ai";

export async function fuzzySearchMedia(query: string): Promise<MediaSearchResult[]> {
  // First, do a standard search
  const directResults = await searchMedia(query);
  if (directResults.length > 0) {
    return directResults;
  }

  // If no results, try to guess the intended movie/show title using AI
  try {
    const aiModel = await getAIModel();
    const { object } = await generateObject({
      model: aiModel,
      schema: z.object({
        titles: z.array(z.string()).min(1).max(3),
      }),
      prompt: `The user searched for a movie or TV show using the query: "${query}". 
      No exact matches were found. Please generate 1 to 3 real movie or TV show titles that they likely meant (correcting typos, alternative names, or closely related media).
      Return just the titles as strings.`,
      temperature: 0.5,
    });

    // Take the best guess and search again
    if (object.titles && object.titles.length > 0) {
      const bestGuess = object.titles[0];
      return await searchMedia(bestGuess);
    }
  } catch (error) {
    console.error("Fuzzy AI search failed:", error);
  }

  return [];
}
