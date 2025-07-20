"use client"

import { useEffect, useState } from "react"
import { searchMovies, type MovieDetails } from "@/lib/omdb"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface TVShowGridDynamicProps {
  genre?: string
  year?: string
  searchQuery?: string
}

// Hardcoded popular TV series IMDb IDs
const HARDCODED_SERIES_IDS = [
  "tt0944947", // Game of Thrones
  "tt0903747", // Breaking Bad
  "tt1475582", // Sherlock
  "tt4574334", // Stranger Things
  "tt2861424", // Rick and Morty
  "tt2442560", // Peaky Blinders
  "tt7366338", // Chernobyl
  "tt2395695", // Hannibal
  "tt0411008", // Lost
  "tt0386676", // The Office (US)
  "tt0108778", // Friends
  "tt0944947", // Game of Thrones (again, for variety)
  "tt1520211", // The Walking Dead
  "tt0795176", // Planet Earth
  "tt2306299", // Vikings
  "tt0455275", // Prison Break
  "tt1856010", // House of Cards
  "tt2802850", // Fargo
  "tt5180504", // The Witcher
  "tt1190634", // The Boys
  "tt5753856", // Dark
]

export function TVShowGridDynamic({ genre, year, searchQuery = "series" }: TVShowGridDynamicProps) {
  const [shows, setShows] = useState<MovieDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchShows()
  }, [genre, year, searchQuery])

  async function fetchShows() {
    try {
      setLoading(true)
      // If no filters, show hardcoded popular series
      if (!genre && !year && (!searchQuery || searchQuery === "series" || searchQuery === "popular series")) {
        const details = await Promise.all(
          HARDCODED_SERIES_IDS.map(async (imdbID) => {
            const res = await fetch(`/api/omdb?id=${imdbID}`)
            const data = await res.json()
            return data.Response === 'True' ? data : null
          })
        )
        setShows(details.filter(Boolean))
        setHasMore(false)
        return
      }
      // Otherwise, search as before
      let query = genre ? `${genre} tv` : "popular tv shows"
      if (year) {
        query += ` ${year}`
      }
      const searchQueries = [
        query,
        `${query} series`,
        genre ? `${genre} series` : "tv series"
      ]
      const allResults: MovieDetails[] = []
      for (const searchQuery of searchQueries) {
        const results = await searchMovies(searchQuery, "series")
        const seriesResults = results.filter(show => 
          show.Type === 'series' && 
          !allResults.some(existing => existing.imdbID === show.imdbID)
        )
        allResults.push(...seriesResults)
      }
      setShows(allResults)
      setHasMore(allResults.length >= 10)
    } catch (error) {
      console.error('Error fetching TV shows:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && shows.length === 0) {
    return <div className="text-center py-8">Loading TV shows...</div>
  }

  if (!loading && shows.length === 0) {
    return <div className="text-center py-8">No TV shows found</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {shows.map((show) => (
          <TVShowResultCard key={show.imdbID || `${show.Title}-${show.Year}`} show={show} />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setPage((p) => p + 1)
              fetchShows()
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}

function TVShowResultCard({ show }: { show: MovieDetails }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [seeds, setSeeds] = useState<any[]>([])
  const [seedsLoading, setSeedsLoading] = useState(false)
  const [seedsError, setSeedsError] = useState<string | null>(null)
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null)
  const [season, setSeason] = useState("1")
  const [episode, setEpisode] = useState("1")
  const [seasonOptions, setSeasonOptions] = useState<string[]>([])
  const [episodeOptions, setEpisodeOptions] = useState<string[]>([])
  const router = useRouter();

  // Optionally, fetch season/episode count from OMDb if available
  useEffect(() => {
    if (!dialogOpen) return;
    if (!show.imdbID) return;
    // Try to fetch season count from OMDb
    const fetchSeasons = async () => {
      try {
        const res = await fetch(`/api/omdb?id=${show.imdbID}`)
        const data = await res.json()
        if (data && data.totalSeasons) {
          const seasons = Array.from({ length: Number(data.totalSeasons) }, (_, i) => String(i + 1))
          setSeasonOptions(seasons)
        } else {
          setSeasonOptions(["1"])
        }
      } catch {
        setSeasonOptions(["1"])
      }
    }
    fetchSeasons()
  }, [dialogOpen, show.imdbID])

  useEffect(() => {
    // Try to fetch episode count for the selected season
    if (!dialogOpen || !show.imdbID || !season) return;
    const fetchEpisodes = async () => {
      try {
        const res = await fetch(`/api/omdb?id=${show.imdbID}&season=${season}`)
        const data = await res.json()
        if (data && data.Episodes && Array.isArray(data.Episodes)) {
          setEpisodeOptions(data.Episodes.map((ep: any) => String(ep.Episode)))
        } else {
          setEpisodeOptions(["1"])
        }
      } catch {
        setEpisodeOptions(["1"])
      }
    }
    fetchEpisodes()
  }, [dialogOpen, show.imdbID, season])

  // Fetch seeds when dialog opens or when season/episode changes
  useEffect(() => {
    if (!dialogOpen) return;
    if (!show.Title) return;
    setSeeds([])
    setSeedsError(null)
    setSeedsLoading(false)
  }, [dialogOpen, show.Title, season, episode])

  const handleFetchMagnets = async () => {
    setSeedsLoading(true)
    setSeedsError(null)
    setSeeds([])
    try {
      // Search for "Show Name S01E01"
      const paddedSeason = season.padStart(2, "0")
      const paddedEpisode = episode.padStart(2, "0")
      const query = `${show.Title} S${paddedSeason}E${paddedEpisode}`
      const res = await fetch(`/api/search?movie=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (res.ok && data.results) {
        setSeeds(data.results)
      } else {
        setSeedsError(data.error || 'No seeds found')
      }
    } catch (err) {
      setSeedsError('Failed to fetch seeds')
    } finally {
      setSeedsLoading(false)
    }
  }

  const handleStream = async (magnet: string, index: number, name: string) => {
    if (streamingIndex !== null) return;
    setStreamingIndex(index)
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ magnet }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to start stream')
      toast({
        title: 'Stream started!',
        description: 'Redirecting to player...',
        variant: 'default',
      })
      router.push(`/stream/${data.streamId}?title=${encodeURIComponent(name)}`)
    } catch (error: any) {
      toast({
        title: 'Failed to start streaming',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setStreamingIndex(null)
    }
  }

  return (
    <Card className="hover:scale-105 transition-transform">
      <CardContent className="p-2">
        {show.Poster && show.Poster !== 'N/A' ? (
          <div className="relative aspect-[2/3]">
            <Image
              src={show.Poster}
              alt={show.Title}
              fill
              className="object-cover rounded-sm"
            />
          </div>
        ) : (
          <div className="aspect-[2/3] bg-muted flex items-center justify-center rounded-sm">
            No Poster
          </div>
        )}
        <div className="pt-2">
          <h3 className="font-medium line-clamp-1">{show.Title}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{show.Year}</span>
            {show.imdbRating && show.imdbRating !== 'N/A' && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{show.imdbRating}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Watch Now
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Available Seeds for "{show.Title}"</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 mb-4">
              <div>
                <Label htmlFor="season">Season</Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="episode">Episode</Label>
                <Select value={episode} onValueChange={setEpisode}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Episode" />
                  </SelectTrigger>
                  <SelectContent>
                    {episodeOptions.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleFetchMagnets} className="self-end">Fetch Magnet Links</Button>
            </div>
            {seedsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
              </div>
            ) : seedsError ? (
              <div className="text-red-500 text-center py-4">{seedsError}</div>
            ) : seeds.length === 0 ? (
              <div className="text-center py-4">No seeds found.</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {seeds
                  .filter(seed => seed.name && (seed.name.toLowerCase().endsWith('.mp4') || seed.name.toLowerCase().endsWith('.webm')))
                  .map((seed, idx) => (
                    <Card key={idx} className="bg-muted">
                      <CardContent className="py-3 px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{seed.name}</div>
                          <div className="text-xs text-muted-foreground flex gap-4 mt-1">
                            <span>Seeders: <span className="text-green-500 font-bold">{seed.seeders}</span></span>
                            <span>Size: {seed.size}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 text-white hover:bg-blue-700 min-w-[100px]"
                          disabled={streamingIndex === idx}
                          onClick={() => handleStream(seed.magnet, idx, seed.movieInfo?.title || seed.name)}
                        >
                          {streamingIndex === idx ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          Stream
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
            <DialogClose asChild>
              <Button variant="outline" className="w-full mt-4">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
} 