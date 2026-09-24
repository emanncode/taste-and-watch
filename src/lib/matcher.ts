// src/lib/matcher.ts

const genreToFoodMap: Record<string, string[]> = {
  Action: ["spicy", "wings", "nachos", "fast"],
  Adventure: ["trail mix", "campfire", "bbq", "exotic"],
  Animation: ["colorful", "sweet", "snacks", "japanese"],
  Comedy: ["pizza", "popcorn", "finger food", "dip"],
  Crime: ["coffee", "donut", "steak", "dark"],
  Documentary: ["healthy", "salad", "vegan", "brain food"],
  Drama: ["comfort food", "wine", "pasta", "chocolate"],
  Family: ["kid friendly", "mac and cheese", "cookies", "burgers"],
  Fantasy: ["medieval", "feast", "stew", "bread"],
  History: ["traditional", "classic", "roast", "rustic"],
  Horror: ["bloody", "red", "meat", "spooky"],
  Music: ["party", "tapas", "cocktails", "bites"],
  Mystery: ["dark", "soup", "tea", "complex"],
  Romance: ["chocolate", "strawberry", "fondue", "elegant"],
  "Science Fiction": ["modern", "molecular", "space", "neon"],
  "TV Movie": ["tv dinner", "casserole", "easy", "quick"],
  Thriller: ["spicy", "intense", "chili", "espresso"],
  War: ["canned", "stew", "potato", "hardy"],
  Western: ["bbq", "beans", "beef", "cornbread"],
};

export function getFoodQueryFromGenres(genres: string[]): string {
  if (!genres || genres.length === 0) return "snack"; // Default fallback

  let foodKeywords: string[] = [];

  // Loop through the movie's genres and pull the associated food words
  genres.forEach((genre) => {
    if (genreToFoodMap[genre]) {
      foodKeywords = [...foodKeywords, ...genreToFoodMap[genre]];
    }
  });

  // Shuffle the array to get a random mix of the mapped keywords
  const shuffled = foodKeywords.sort(() => 0.5 - Math.random());

  // Return top 2 keywords as a comma-separated string for the Spoonacular API
  return shuffled.slice(0, 2).join(",");
}
