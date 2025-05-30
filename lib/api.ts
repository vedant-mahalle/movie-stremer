const OMDB_API_KEY = 'b0588703';

// Different movie lists for each section
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

export async function fetchMovieByTitle(title: string) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
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

export async function fetchMoviesByCategory(category: 'hero' | 'trending' | 'popular' | 'new') {
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