import readline from 'readline';

const TMDB_API_KEY = 'b0588703'; // Replace with your TMDB API key
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

interface MovieResult {
  id: number;
  title: string;
  poster_path: string | null;
}

async function getMoviePoster(movieName: string): Promise<string | null> {
  try {
    const url = new URL(`${TMDB_API_BASE}/search/movie`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    url.searchParams.append('query', movieName);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('Failed to fetch:', response.statusText);
      return null;
    }

    const data = await response.json();
    const results: MovieResult[] = data.results;

    if (results.length === 0 || !results[0].poster_path) {
      return null;
    }

    return `${TMDB_IMAGE_BASE}${results[0].poster_path}`;
  } catch (error) {
    console.error('Error fetching movie poster:', error);
    return null;
  }
}

function askMovieName(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question('Enter movie name: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const movieName = await askMovieName();
  const posterUrl = await getMoviePoster(movieName);

  if (posterUrl) {
    console.log(`Poster for "${movieName}": ${posterUrl}`);
  } else {
    console.log(`Poster not found for "${movieName}".`);
  }
}

main();
