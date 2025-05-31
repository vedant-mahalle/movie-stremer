import { NextResponse } from 'next/server';
import { piratebay } from 'piratebay-scraper';

const OMDB_API_KEY = process.env.OMDB_API_KEY; // Using the same API key from your code

async function getMovieInfo(title: string) {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`
    );
    const data = await response.json();
    return data.Response === 'True' ? data : null;
  } catch (error) {
    console.error('Error fetching movie info:', error);
    return null;
  }
}

function cleanTitle(name: string): string {
  try {
    // First, extract the main title before any year or quality indicators
    let cleanedTitle = name
      .replace(/\.(mp4|mkv|avi|mov|wmv|flv)$/i, '') // Remove video extensions
      .replace(/\b(480p|720p|1080p|2160p|HDTV|BluRay|WEB-DL|WEBRip|BRRip|DVDRip)\b.*$/i, '') // Remove quality tags
      .replace(/\b(x264|x265|HEVC|AAC|AC3|YIFY|RARBG)\b.*$/i, '') // Remove codec and release group
      .replace(/\[[^\]]*\]/g, '') // Remove anything in square brackets
      .replace(/\([^)]*\)/g, '') // Remove anything in parentheses
      .replace(/\b(Complete|Season|Series|Episode|S\d{2}E\d{2}|E\d{2})\b.*$/i, '') // Remove TV show indicators
      .replace(/[-._]/g, ' ') // Replace separators with spaces
      .trim();

    // If we have a year in the title, keep only the part before it
    const yearMatch = cleanedTitle.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      cleanedTitle = cleanedTitle.substring(0, yearMatch.index).trim();
    }

    return cleanedTitle;
  } catch (error) {
    console.error('Error cleaning title:', error);
    return name;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movie = searchParams.get('movie');

  if (!movie) {
    return NextResponse.json(
      { error: 'Missing movie parameter' },
      { status: 400 }
    );
  }

  try {
    console.log("Searching for movie:", movie);
    const results = await piratebay.search(movie);
    console.log("Search results:", results);
    
    if (results && Array.isArray(results) && results.length > 0) {
      // Get movie info for each unique title
      const processedResults = await Promise.all(
        results
          .filter(result => result && typeof result === 'object' && 'title' in result)
          .map(async (result) => {
            try {
              // Extract likely movie name from torrent name
              const cleanedTitle = cleanTitle(result.title);
              console.log("Cleaned title:", cleanedTitle);
              const movieInfo = await getMovieInfo(cleanedTitle);
              console.log("Movie info for", cleanedTitle, ":", movieInfo);
              
              return {
                name: result.title || 'Unknown',
                size: result.size || 'Unknown',
                seeders: typeof result.seeders === 'number' ? result.seeders : 0,
                leechers: typeof result.leechers === 'number' ? result.leechers : 0,
                uploadDate: result.uploaded || 'Unknown',
                magnet: result.link || '',
                movieInfo: movieInfo ? {
                  title: movieInfo.Title || 'Unknown',
                  year: movieInfo.Year || 'N/A',
                  poster: movieInfo.Poster || 'N/A',
                  plot: movieInfo.Plot || 'No plot available',
                  rating: movieInfo.imdbRating || 'N/A',
                  genre: movieInfo.Genre || 'Unknown'
                } : null
              };
            } catch (error) {
              console.error('Error processing result:', error);
              return null;
            }
          })
      );

      // Filter out null results
      const validResults = processedResults.filter(result => result !== null);

      if (validResults.length === 0) {
        return NextResponse.json(
          { error: 'No valid results found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ results: validResults });
    } else {
      console.log("No results found");
      return NextResponse.json(
        { error: 'No results found' },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Error fetching results:", err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 