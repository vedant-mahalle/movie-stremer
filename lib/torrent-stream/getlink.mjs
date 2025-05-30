
import { piratebay } from 'piratebay-scraper';

export default async function handler(req, res) {
  const { movie } = req.query;

  if (!movie) {
    return res.status(400).json({ error: 'Missing movie parameter' });
  }

  try {
    const results = await piratebay.search(movie);
    const magnet = results;

    if (magnet) {
      console.log("Magnet Link:", magnet);
      return res.status(200).json({ magnet });
    } else {
      return res.status(404).json({ error: 'No results found' });
    }
  } catch (err) {
    console.error("Error fetching magnet link:", err);
    return res.status(500).json({ error: 'Server error' });
  }
}