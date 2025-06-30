const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
}

export async function getMovieById(imdbId: string): Promise<MovieDetails | null> {
  try {
    const response = await fetch(
      `/api/omdb?id=${encodeURIComponent(imdbId)}`
    );
    const data = await response.json();
    return data.Response === 'True' ? data : null;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

// Utility to map Trakt movie data to OMDB-like format, using OMDB for poster and details if available
async function mapTraktToMovie(traktMovie: any) {
  const movie = traktMovie.movie || traktMovie;
  let omdbData = null;
  if (movie.ids?.imdb) {
    try {
      const omdbRes = await fetch(`/api/omdb?id=${movie.ids.imdb}`);
      omdbData = await omdbRes.json();
      if (omdbData && omdbData.Response !== 'True') omdbData = null;
    } catch (e) {
      omdbData = null;
    }
  }
  return {
    Title: movie.title,
    Year: movie.year?.toString() || '',
    Rated: omdbData?.Rated || '',
    Released: omdbData?.Released || '',
    Runtime: omdbData?.Runtime || '',
    Genre: omdbData?.Genre || '',
    Director: omdbData?.Director || '',
    Writer: omdbData?.Writer || '',
    Actors: omdbData?.Actors || '',
    Plot: omdbData?.Plot || '',
    Language: omdbData?.Language || '',
    Country: omdbData?.Country || '',
    Awards: omdbData?.Awards || '',
    Poster: omdbData?.Poster && omdbData.Poster !== 'N/A' ? omdbData.Poster : (movie.images?.poster?.full || ''),
    Ratings: omdbData?.Ratings || [],
    imdbRating: omdbData?.imdbRating || '',
    imdbVotes: omdbData?.imdbVotes || '',
    imdbID: movie.ids?.imdb || movie.ids?.slug || '',
    Type: 'movie',
  };
}

export async function searchMovies(query: string, type?: "movie" | "series"): Promise<MovieDetails[]> {
  try {
    // Try Trakt API search
    const traktRes = await fetch(`/api/trakt?category=trending&limit=30`); // Trakt does not support search in this proxy, so fallback to trending
    const traktData = await traktRes.json();
    if (Array.isArray(traktData) && traktData.length > 0) {
      // Enrich all Trakt movies with OMDB data
      return await Promise.all(traktData.map(mapTraktToMovie));
    }
    // Fallback to OMDB
    let url = `/api/omdb?q=${encodeURIComponent(query)}`;
    if (type) {
      url += `&type=${type}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data.Response === 'True' ? data.Search : [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
} 