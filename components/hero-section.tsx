"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Info, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { fetchMoviesByCategory } from "@/lib/api"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [seeds, setSeeds] = useState<any[]>([])
  const [seedsLoading, setSeedsLoading] = useState(false)
  const [seedsError, setSeedsError] = useState<string | null>(null)
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null)
  const router = useRouter();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const heroMovies = await fetchMoviesByCategory('hero')
        setMovies(heroMovies)
      } catch (error) {
        console.error('Error loading hero movies:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
  }, [])

  useEffect(() => {
    if (movies.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [movies.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
  }
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length)
  }

  const currentMovie = movies[currentIndex]

  // Fetch seeds when dialog opens
  useEffect(() => {
    if (!dialogOpen) return;
    if (!currentMovie) return;
    const fetchSeeds = async () => {
      setSeedsLoading(true)
      setSeedsError(null)
      setSeeds([])
      try {
        const res = await fetch(`/api/search?movie=${encodeURIComponent(currentMovie.Title)}`)
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
  }, [dialogOpen, currentMovie])

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

  // Only return JSX after all hooks
  if (loading || movies.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </section>
    )
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Background overlay for subtle effect */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Main content area: Flex container for left info and right image */}
      <div className="relative container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center">
        {/* Left side: Movie Information */}
        <div className="max-w-2xl md:w-1/2 space-y-6 text-center md:text-left z-10 p-4 md:p-0">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <Badge variant="secondary" className="bg-red-600 text-white hover:bg-red-700">
              Featured
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white">
              {currentMovie.Year}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white">
              {currentMovie.Genre?.split(', ')[0]}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {currentMovie.Title}
          </h1>

          <p className="text-lg text-gray-200 leading-relaxed line-clamp-3">
            {currentMovie.Plot}
          </p>

          <div className="flex items-center justify-center md:justify-start space-x-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  <Play className="mr-2 h-5 w-5" />
                  Play Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Available Seeds for "{currentMovie.Title}"</DialogTitle>
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
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hidden md:flex"> {/* Hide on smaller screens */}
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-300">
            <span>⭐ {currentMovie.imdbRating}/10</span>
            <span>{currentMovie.Runtime}</span>
            <span>{currentMovie.Rated}</span>
          </div>
        </div>

        {/* Right side: Movie Poster */}
        <div className="md:w-1/2 flex justify-center items-center p-4 z-10 mt-8 md:mt-0">
          <div className="relative w-64 h-96 md:w-80 md:h-[28rem] rounded-lg shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <Image
              src={currentMovie.Poster !== 'N/A' ? currentMovie.Poster : '/placeholder.jpg'}
              alt={currentMovie.Title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}