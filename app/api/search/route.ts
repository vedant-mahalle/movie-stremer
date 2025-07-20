import { NextResponse } from 'next/server';
import { piratebay } from 'piratebay-scraper';
import fetch from 'node-fetch';

const OMDB_API_KEY = process.env.OMDB_API_KEY;
if (!OMDB_API_KEY) {
  throw new Error('OMDB_API_KEY is not set in environment variables');
}

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
  let movie = searchParams.get('movie');

  if (!movie) {
    return NextResponse.json(
      { error: 'Missing movie parameter' },
      { status: 400 }
    );
  }

  // Clean up the movie query: remove special characters, asterisks, and extra spaces
  movie = movie.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

  // Extract year if present
  const yearMatch = movie.match(/(19|20)\d{2}/);
  let year = null;
  if (yearMatch) {
    year = parseInt(yearMatch[0], 10);
  }
  // If the year is in the future, return a user-friendly message
  const currentYear = new Date().getFullYear();
  if (year && year > currentYear) {
    return NextResponse.json(
      { error: 'No torrents available for unreleased movies. Try searching for a released movie.' },
      { status: 404 }
    );
  }

  let validResults = [];
  let piratebayError = null;
  let triedPatterns = false;
  try {
    // TV show pattern fallback
    const tvShowMatch = movie.match(/(.+?)\sS(\d{2})E(\d{2})/i);
    if (tvShowMatch) {
      triedPatterns = true;
      const showTitle = tvShowMatch[1].trim();
      const season = tvShowMatch[2];
      const episode = tvShowMatch[3];
      const patterns = [
        `${showTitle} S${season}E${episode}`,
        `${showTitle.replace(/\s+/g, '.')} S${season}E${episode}`,
        `${showTitle} ${season}x${episode}`,
        `${showTitle} Season ${parseInt(season, 10)} Episode ${parseInt(episode, 10)}`,
        `${showTitle} ${season}${episode}`,
        `${showTitle} S${season}` // fallback to season only
      ];
      for (const pattern of patterns) {
        const results = await piratebay.search(pattern);
        if (results && Array.isArray(results) && results.length > 0) {
          const processedResults = await Promise.all(
            results
              .filter(result => result && typeof result === 'object' && 'title' in result)
              .map(async (result) => {
                try {
                  const cleanedTitle = cleanTitle(result.title);
                  const movieInfo = await getMovieInfo(cleanedTitle);
                  return {
                    name: result.title || 'Unknown',
                    size: result.size || 'Unknown',
                    seeders: Number(result.seeders) || 0,
                    leechers: Number(result.leechers) || 0,
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
                  return null;
                }
              })
          );
          validResults = processedResults.filter(result => result !== null);
          if (validResults.length > 0) break;
        }
      }
    }
    if (!triedPatterns) {
      const results = await piratebay.search(movie);
      if (results && Array.isArray(results) && results.length > 0) {
        const processedResults = await Promise.all(
          results
            .filter(result => result && typeof result === 'object' && 'title' in result)
            .map(async (result) => {
              try {
                const cleanedTitle = cleanTitle(result.title);
                const movieInfo = await getMovieInfo(cleanedTitle);
                return {
                  name: result.title || 'Unknown',
                  size: result.size || 'Unknown',
                  seeders: Number(result.seeders) || 0,
                  leechers: Number(result.leechers) || 0,
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
                return null;
              }
            })
        );
        validResults = processedResults.filter(result => result !== null);
      }
    }
  } catch (err) {
    piratebayError = err;
  }

  // Fallback to YTS if no results from Piratebay
  if (validResults.length === 0 && year) {
    try {
      const ytsRes = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(movie)}&year=${year}`);
      const ytsData = await ytsRes.json();
      if (ytsData && ytsData.data && ytsData.data.movies && ytsData.data.movies.length > 0) {
        const ytsResults = ytsData.data.movies.flatMap((m: any) =>
          (m.torrents || []).map((t: any) => ({
            name: `${m.title} [YTS] ${t.quality} ${t.type}`,
            size: t.size,
            seeders: Number(t.seeds) || 0,
            leechers: Number(t.peers) || 0,
            uploadDate: t.date_uploaded,
            magnet: t.url || '',
            movieInfo: {
              title: m.title,
              year: m.year,
              poster: m.medium_cover_image,
              plot: m.summary,
              rating: m.rating,
              genre: (m.genres || []).join(', ')
            }
          }))
        );
        validResults = [...validResults, ...ytsResults];
      }
    } catch (err) {
      // ignore YTS error
    }
  }

  // Deduplicate by magnet link
  validResults = validResults.filter((r, i, arr) => r.magnet && arr.findIndex(x => x.magnet === r.magnet) === i);

  if (validResults.length === 0) {
    return NextResponse.json(
      { error: 'No results found. Try a different or simpler search term.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ results: validResults });
} 