"use server";
import { ipv4Fetch } from "./fetch";

export interface MediaSearchResult {
  primaryGenre: string | null;
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

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adv", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics"
};

export async function searchMedia(query: string, page: number = 1): Promise<{ results: MediaSearchResult[], totalPages: number }> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  if (!query.trim()) {
    return { results: [], totalPages: 0 };
  }

  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;

  const res = await ipv4Fetch(
    url,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`TMDB Search API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const results = data.results || [];
  const totalPages = data.total_pages || 1;

  // Fetch textless posters in parallel for all valid results
  const validResults = results.filter((item: Record<string, unknown>) => item.media_type === "movie" || item.media_type === "tv");
  
  const textlessPosters = await Promise.all(
    validResults.map(async (item: Record<string, unknown>) => {
      try {
        const type = item.media_type;
        const id = item.id;
        const imagesUrl = `https://api.themoviedb.org/3/${type}/${id}/images?api_key=${apiKey}&include_image_language=null`;
        const imgRes = await ipv4Fetch(imagesUrl, { next: { revalidate: 3600 } });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const textless = imgData.posters && imgData.posters.find((p: Record<string, unknown>) => p.iso_639_1 === null);
          if (textless) {
            return { id, path: textless.file_path };
          }
        }
      } catch {
        // Ignore errors for individual images
      }
      return { id: item.id, path: null };
    })
  );
  
  const textlessMap = new Map(textlessPosters.map((p) => [p.id, p.path]));

  const mappedResults = validResults.map((item: Record<string, unknown>) => {
      const isMovie = item.media_type === "movie";
      const title = isMovie ? (item.title as string) : (item.name as string);
      const releaseDate = isMovie
        ? (item.release_date as string)
        : (item.first_air_date as string);
      const releaseYear = releaseDate ? releaseDate.split("-")[0] : null;

      const genreIds = (item.genre_ids as number[]) || [];
      const primaryGenre = genreIds.length > 0 ? GENRE_MAP[genreIds[0]] || null : null;

      return {
        id: item.id as number,
        primaryGenre,
        title: title || "Unknown Title",
        mediaType: item.media_type as "movie" | "tv",
        releaseYear,
        posterUrl: (() => {
          const textlessPath = textlessMap.get(item.id);
          const finalPath = textlessPath || item.poster_path;
          return finalPath ? `https://image.tmdb.org/t/p/w500${finalPath}` : null;
        })(),
      };
    });
  return { results: mappedResults, totalPages };
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

export async function fuzzySearchMedia(query: string, page: number = 1): Promise<{ results: MediaSearchResult[], totalPages: number, page: number }> {
  // First, do a standard search
  const directResults = await searchMedia(query, page);
  if (directResults.results.length > 0) {
    return { ...directResults, page };
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
      const guessResults = await searchMedia(bestGuess, page);
      return { ...guessResults, page };
    }
  } catch (error) {
    console.error("Fuzzy AI search failed:", error);
  }

  return { results: [], totalPages: 0, page: 1 };
}
