"use server";

export interface TutorialResult {
  title: string;
  url: string;
  thumbnail?: string;
  channelTitle?: string;
  provider: "youtube_api" | "youtube_search";
}

export async function searchTutorial(query: string): Promise<TutorialResult> {
  if (!query) {
    throw new Error("Tutorial search query is required.");
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  // Fallback to direct search URL if API key is not configured or fails
  const fallbackResult: TutorialResult = {
    title: `Search YouTube for "${query}"`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    provider: "youtube_search"
  };

  if (!apiKey) {
    return fallbackResult;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=1&key=${apiKey}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.warn(`YouTube API returned ${res.status}. Falling back to search URL.`);
      return fallbackResult;
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return fallbackResult;
    }

    const item = data.items[0];
    return {
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      provider: "youtube_api"
    };
  } catch (error) {
    console.error("YouTube API request failed:", error);
    return fallbackResult;
  }
}
