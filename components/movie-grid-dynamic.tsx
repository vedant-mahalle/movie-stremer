"use client"

import { useEffect, useState } from "react"
import { searchMovies, type MovieDetails } from "@/lib/omdb"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Play, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface MovieGridDynamicProps {
  genre?: string
  year?: string
  searchQuery?: string
}

export function MovieGridDynamic({ genre, year, searchQuery = "popular" }: MovieGridDynamicProps) {
  const [movies, setMovies] = useState<MovieDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState<string | null>(null)
  const [seeds, setSeeds] = useState<any[]>([])
  const [seedsLoading, setSeedsLoading] = useState(false)
  const [seedsError, setSeedsError] = useState<string | null>(null)
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchMovies()
  }, [genre, year, searchQuery])

  async function fetchMovies() {
    try {
      setLoading(true)
      const query = genre || searchQuery
      const results = await searchMovies(query)
      setMovies(results)
      setHasMore(results.length === 10) // OMDB returns max 10 results per page
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchMagnets = async (movie: MovieDetails) => {
    setSeedsLoading(true)
    setSeedsError(null)
    setSeeds([])
    try {
      const query = `${movie.Title} ${movie.Year || ''}`
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
    if (streamingIndex !== null) return
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

  if (loading && movies.length === 0) {
    return <div className="text-center py-8">Loading movies...</div>
  }

  if (!loading && movies.length === 0) {
    return <div className="text-center py-8">No movies found</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Card key={movie.imdbID} className="hover:scale-105 transition-transform">
              <CardContent className="p-2">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={movie.Poster}
                      alt={movie.Title}
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
                  <h3 className="font-medium line-clamp-1">{movie.Title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{movie.Year}</span>
                    {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{movie.imdbRating}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {movie.Released && movie.Released !== 'N/A' && <div>Release: {movie.Released}</div>}
                    {movie.Genre && movie.Genre !== 'N/A' && <div>Genre: {movie.Genre}</div>}
                    {movie.Plot && movie.Plot !== 'N/A' && <div className="line-clamp-2">{movie.Plot}</div>}
                  </div>
                <Dialog open={dialogOpen === movie.imdbID} onOpenChange={open => {
                  setDialogOpen(open ? movie.imdbID : null)
                  if (open) handleFetchMagnets(movie)
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full mt-2">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Available Seeds for "{movie.Title}"</DialogTitle>
                    </DialogHeader>
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
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setPage((p) => p + 1)
              fetchMovies()
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