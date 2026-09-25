"use server";
import { ipv4Fetch } from "./fetch";

export interface RecipeIngredient {
  ingredient: string;
  measure: string;
}

export interface RecipeDetails {
  id: string;
  name: string;
  category: string | null;
  area: string | null;
  instructions: string;
  imageUrl: string | null;
  youtubeUrl: string | null;
  sourceUrl: string | null;
  ingredients: RecipeIngredient[];
}

export async function searchRecipe(query: string): Promise<RecipeDetails | null> {
  const apiKey = process.env.THEMEALDB_API_KEY || "1"; // "1" is the free test API key for TheMealDB
  
  if (!query.trim()) {
    return null;
  }

  try {
    const res = await ipv4Fetch(
      `https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`TheMealDB API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data.meals || data.meals.length === 0) {
      return null;
    }

    // Pick the first result that best matches (for MVP, we just take the first)
    const meal = data.meals[0];

    // Extract ingredients and measurements (TheMealDB provides them as strIngredient1, strMeasure1, etc. up to 20)
    const ingredients: RecipeIngredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : "",
        });
      }
    }

    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory || null,
      area: meal.strArea || null,
      instructions: meal.strInstructions || "",
      imageUrl: meal.strMealThumb || null,
      youtubeUrl: meal.strYoutube || null,
      sourceUrl: meal.strSource || null,
      ingredients,
    };
  } catch (error) {
    console.error("Failed to fetch recipe from TheMealDB:", error);
    throw new Error("Failed to retrieve recipe data. Please try again later.");
  }
}
