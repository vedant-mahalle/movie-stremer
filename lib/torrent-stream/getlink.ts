import { piratebay } from "piratebay-scraper";

export async function getMagnetLink(movieName: string): Promise<string | null> {
  try {
    console.log("Searching for:", movieName);
    const results = await piratebay.search(movieName);
    console.log("Search results:", results);
    if (!results || results.length === 0) {
      console.log("No results found");
      return null;
    }
    console.log("First result:", results[0]);
    return results[0]?.['link'] || null;
  } catch (error) {
    console.error("Error in getMagnetLink:", error);
    throw error;
  }
}