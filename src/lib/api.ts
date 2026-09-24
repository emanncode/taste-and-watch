// src/lib/api.ts
import { getFoodQueryFromGenres } from "./matcher";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

const USE_MOCK_DATA = true;

// STEP 1: Get a list of movies to choose from
export async function searchMoviesList(query: string) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getMockMovieList();
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`,
    );
    const data = await res.json();
    return data.results ? data.results.slice(0, 5) : []; // Return top 5 matches
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

// STEP 2: Get recipes for the specific movie clicked
export async function fetchRecipePairing(movie: any) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return getMockRecipeData();
  }

  try {
    const genreMap: Record<number, string> = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };

    const movieGenres = movie.genre_ids
      .map((id: number) => genreMap[id])
      .filter(Boolean);
    const foodQuery = getFoodQueryFromGenres(movieGenres);

    const recipeRes = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_KEY}&query=${foodQuery}&number=4&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true`,
    );
    const recipeData = await recipeRes.json();

    return {
      movie: {
        title: movie.title,
        overview: movie.overview,
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/placeholder.jpg",
        genres: movieGenres,
        releaseYear: movie.release_date
          ? movie.release_date.split("-")[0]
          : "Unknown",
      },
      recipes: recipeData.results || [],
      matchedKeywords: foodQuery,
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return null;
  }
}

// --- MOCK DATA ---
function getMockMovieList() {
  return [
    {
      id: 1,
      title: "Batman Begins",
      release_date: "2005-06-10",
      genre_ids: [28, 80],
      poster_path: "/4aJPcwxeCXvB14OqQ0OON7K7K2p.jpg",
      overview: "Mock overview 1",
    },
    {
      id: 2,
      title: "The Batman",
      release_date: "2022-03-01",
      genre_ids: [80, 9648, 53],
      poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      overview: "Mock overview 2",
    },
    {
      id: 3,
      title: "Batman",
      release_date: "1989-06-21",
      genre_ids: [14, 28],
      poster_path: "/cij4dd21v2Rk2YtUQbV5kW69WB2.jpg",
      overview: "Mock overview 3",
    },
  ];
}

function getMockRecipeData() {
  return {
    movie: {
      title: "The Batman (Mock)",
      overview: "Dark, gritty detective story.",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      genres: ["Crime", "Mystery"],
    },
    matchedKeywords: "dark, steak, espresso",
    recipes: [
      {
        id: 1,
        title: "Blackened Steak",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        readyInMinutes: 30,
        extendedIngredients: [{ original: "1 lb ribeye" }],
        analyzedInstructions: [],
      },
    ],
  };
}
