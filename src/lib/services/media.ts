"use server";

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

  const res = await fetch(
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

  const res = await fetch(
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
