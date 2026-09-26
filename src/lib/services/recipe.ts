"use server";
import { ipv4Fetch } from "./fetch";
import { getAIModel } from "./ai";
import { generateObject } from "ai";
import { z } from "zod";

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
  const apiKey = process.env.THEMEALDB_API_KEY || "1";
  
  if (!query.trim()) {
    return null;
  }

  try {
    // Attempt 1: Direct search on TheMealDB
    const res = await ipv4Fetch(
      `https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        return formatMealDBResponse(data.meals[0]);
      }
    }

    // Attempt 2: Clean the query (remove words like "recipe", "how to make") and try again
    const cleanedQuery = query.toLowerCase().replace(/(recipe|how to make|classic|style|with.*)/g, "").trim();
    if (cleanedQuery !== query.toLowerCase() && cleanedQuery.length > 0) {
      const fallbackRes = await ipv4Fetch(
        `https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=${encodeURIComponent(cleanedQuery)}`,
        { next: { revalidate: 3600 } }
      );
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (fallbackData.meals && fallbackData.meals.length > 0) {
          return formatMealDBResponse(fallbackData.meals[0]);
        }
      }
    }

    // Attempt 3: TheMealDB failed entirely. Generate a highly accurate recipe on the fly using AI!
    console.log(`TheMealDB failed for "${query}". Falling back to AI Generation...`);
    const aiModel = await getAIModel();
    const { object } = await generateObject({
      model: aiModel,
      schema: z.object({
        name: z.string(),
        category: z.string().nullable(),
        area: z.string().nullable(),
        instructions: z.string(),
        ingredients: z.array(z.object({
          ingredient: z.string(),
          measure: z.string()
        })).min(3).max(20)
      }),
      prompt: `The user requested a recipe for "${query}". The recipe database failed to find it. 
      Please act as a master chef and provide a complete, authentic, and structured recipe for this dish.
      The instructions must be a single, detailed string (you can use paragraphs or numbered steps).`,
      temperature: 0.5,
    });

    return {
      id: `ai-generated-${Date.now()}`,
      name: object.name,
      category: object.category,
      area: object.area,
      instructions: object.instructions,
      imageUrl: null, // AI cannot generate images natively here
      youtubeUrl: null,
      sourceUrl: null,
      ingredients: object.ingredients,
    };

  } catch (error) {
    console.error("Failed to fetch or generate recipe:", error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatMealDBResponse(meal: any): RecipeDetails {
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
}
