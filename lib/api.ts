// Different movie lists for each section (fallback)
export const HERO_MOVIES = [
  'Dune: Part Two',
  'Oppenheimer',
  'Poor Things',
  'Killers of the Flower Moon',
  'The Batman'
];

export const TRENDING_MOVIES = [
  'Barbie',
  'Oppenheimer',
  'Mission: Impossible - Dead Reckoning',
  'The Killer',
  'Napoleon',
  'Blue Beetle',
  'Gran Turismo',
  'The Creator'
];

export const POPULAR_MOVIES = [
  'The Dark Knight',
  'Inception',
  'Interstellar',
  'Pulp Fiction',
  'The Matrix',
  'Forrest Gump',
  'The Godfather',
  'Fight Club'
];

export const NEW_RELEASES = [
  'Dune: Part Two',
  'Madame Web',
  'Bob Marley: One Love',
  'Anyone But You',
  'Migration',
  'Mean Girls',
  'The Beekeeper',
  'Argylle'
];

// Dynamic search queries for different categories
const SEARCH_QUERIES = {
  hero: ['2024', '2023', 'blockbuster'],
  trending: ['popular', 'trending', 'box office'],
  popular: ['classic', 'best', 'award winning'],
  new: ['2024', 'recent', 'new release']
};

export async function fetchMovieByTitle(title: string) {
  try {
    // Try Trakt API (not supported for single title, so fallback to OMDB)
    const response = await fetch(`/api/omdb?q=${encodeURIComponent(title)}`);
    const data = await response.json();
    if (data.Response === 'True') {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

// NEW: Dynamic movie fetching
export async function fetchMoviesBySearch(query: string, limit: number = 10) {
  try {
    // Try Trakt API (not supported for search, so fallback to OMDB)
    const response = await fetch(`/api/omdb?q=${encodeURIComponent(query)}&type=movie`);
    const data = await response.json();
    if (data.Response === 'True' && data.Search) {
      // Get detailed info for each movie
      const detailedMovies = await Promise.all(
        data.Search.slice(0, limit).map(async (movie: any) => {
          const details = await fetchMovieByTitle(movie.Title);
          return details || movie;
        })
      );
      return detailedMovies.filter(movie => movie !== null);
    }
    return [];
  } catch (error) {
    console.error('Error fetching movies by search:', error);
    return [];
  }
}

// Utility to map Trakt movie data to OMDB-like format, using OMDB for poster if Trakt poster is missing
async function mapTraktToMovie(traktMovie: any) {
  const movie = traktMovie.movie || traktMovie;
  let poster = movie.images?.poster?.full || '';
  // If no poster from Trakt, try OMDB
  if (!poster && movie.ids?.imdb) {
    try {
      const omdbRes = await fetch(`/api/omdb?id=${movie.ids.imdb}`);
      const omdbData = await omdbRes.json();
      if (omdbData && omdbData.Poster && omdbData.Poster !== 'N/A') {
        poster = omdbData.Poster;
      }
    } catch (e) {
      // Ignore OMDB errors
    }
  }
  return {
    Title: movie.title,
    Year: movie.year?.toString() || '',
    Rated: '',
    Released: '',
    Runtime: '',
    Genre: '',
    Director: '',
    Writer: '',
    Actors: '',
    Plot: '',
    Language: '',
    Country: '',
    Awards: '',
    Poster: poster,
    Ratings: [],
    imdbRating: '',
    imdbVotes: '',
    imdbID: movie.ids?.imdb || movie.ids?.slug || '',
    Type: 'movie',
  };
}

// Update fetchTraktMovies to use the new async mapTraktToMovie
async function fetchTraktMovies(category: 'hero' | 'trending' | 'popular' | 'new', limit: number = 10) {
  let traktCategory = category;
  if (category === 'hero') traktCategory = 'trending';
  const res = await fetch(`/api/trakt?category=${traktCategory}&limit=${limit}`);
  const data = await res.json();
  if (Array.isArray(data)) {
    // Use Promise.all to await poster fetching
    return await Promise.all(data.map(mapTraktToMovie));
  }
  return [];
}

export async function fetchMoviesByCategoryDynamic(category: 'hero' | 'trending' | 'popular' | 'new') {
  // Try Trakt first
  const traktMovies = await fetchTraktMovies(category, 10);
  if (traktMovies.length > 0) return traktMovies;
  // Fallback to OMDB logic if Trakt fails
  const queries = SEARCH_QUERIES[category];
  const allMovies: any[] = [];
  
  // Try multiple search queries to get diverse results
  for (const query of queries) {
    try {
      const movies = await fetchMoviesBySearch(query, 5);
      allMovies.push(...movies);
    } catch (error) {
      console.error(`Error fetching movies for query "${query}":`, error);
    }
  }
  
  // Remove duplicates and return unique movies
  const uniqueMovies = allMovies.filter((movie, index, self) => 
    index === self.findIndex(m => m.imdbID === movie.imdbID)
  );
  
  return uniqueMovies.slice(0, 10);
}

export async function fetchMoviesByCategory(category: 'hero' | 'trending' | 'popular' | 'new') {
  try {
    // Try dynamic fetching first (Trakt preferred)
    const dynamicMovies = await fetchMoviesByCategoryDynamic(category);
    if (dynamicMovies.length > 0) {
      return dynamicMovies;
    }
  } catch (error) {
    console.error('Dynamic fetching failed, using fallback:', error);
  }
  
  // Fallback to hardcoded lists
  let movieList;
  switch (category) {
    case 'hero':
      movieList = HERO_MOVIES;
      break;
    case 'trending':
      movieList = TRENDING_MOVIES;
      break;
    case 'popular':
      movieList = POPULAR_MOVIES;
      break;
    case 'new':
      movieList = NEW_RELEASES;
      break;
    default:
      movieList = TRENDING_MOVIES;
  }

  const moviePromises = movieList.map(title => fetchMovieByTitle(title));
  const results = await Promise.all(moviePromises);
  return results.filter(movie => movie !== null);
} 