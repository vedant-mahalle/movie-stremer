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

export async function searchMovies(query: string, type?: "movie" | "series"): Promise<MovieDetails[]> {
  try {
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