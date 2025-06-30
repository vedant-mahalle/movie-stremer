"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getMovieById, type MovieDetails } from "@/lib/omdb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Calendar, Award, Play } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface MovieDetailsProps {
  movieId: string
}

export function MovieDetails({ movieId }: MovieDetailsProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [seeds, setSeeds] = useState<any[]>([])
  const [seedsLoading, setSeedsLoading] = useState(false)
  const [seedsError, setSeedsError] = useState<string | null>(null)
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null)
  const router = useRouter();

  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await getMovieById(movieId)
        setMovie(data)
      } catch (err) {
        setError('Failed to load movie details')
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [movieId])

  // Fetch seeds when dialog opens
  useEffect(() => {
    if (!dialogOpen) return;
    if (!movie) return;
    const fetchSeeds = async () => {
      setSeedsLoading(true)
      setSeedsError(null)
      setSeeds([])
      try {
        const res = await fetch(`/api/search?movie=${encodeURIComponent(movie.Title)}`)
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
    fetchSeeds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, movie])

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

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (error || !movie) {
    return <div className="container mx-auto px-4 py-8">Failed to load movie details</div>
  }

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        {/* {movie.Poster && movie.Poster !== 'N/A' && (
          <Image
            src={movie.Poster}
            alt={movie.Title}
            fill
            className="object-cover p-2 m-2 opacity-20"
          />
        )} */}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-80">
            <div className="rounded-lg overflow-hidden shadow-xl">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <Image
                  src={movie.Poster}
                  alt={movie.Title}
                  width={320}
                  height={480}
                  className="w-full"
                />
              ) : (
                <div className="w-full h-[480px] bg-muted flex items-center justify-center">
                  No Poster Available
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-grow space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.Title}</h1>
              <div className="flex flex-wrap gap-4 items-center text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.Year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.Runtime}</span>
                </div>
                {movie.imdbRating !== 'N/A' && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{movie.imdbRating}/10</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.Genre.split(', ').map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            <p className="text-lg leading-relaxed">{movie.Plot}</p>

            <div className="space-y-4">
              {movie.Director !== 'N/A' && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Director</h3>
                  <p>{movie.Director}</p>
                </div>
              )}
              {movie.Actors !== 'N/A' && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cast</h3>
                  <p>{movie.Actors}</p>
                </div>
              )}
              {movie.Awards !== 'N/A' && (
                <div className="flex items-start gap-2">
                  <Award className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <p>{movie.Awards}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
              <Button size="lg">Watch Now</Button>
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
                      {seeds.map((seed, idx) => (
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
              <Button size="lg" variant="outline">Add to List</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 