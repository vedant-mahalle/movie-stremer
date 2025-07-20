"use client"

import { useEffect, useState } from "react"
import { searchMovies, type MovieDetails } from "@/lib/omdb"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface RelatedMoviesProps {
  genre?: string
  year?: string
}

export function RelatedMovies({ genre, year }: RelatedMoviesProps) {
  const [movies, setMovies] = useState<MovieDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelatedMovies() {
      try {
        // Search by genre if available, otherwise use a popular search term
        const searchTerm = genre ? genre : "popular"
        const results = await searchMovies(searchTerm)
        setMovies(results)
      } catch (error) {
        console.error('Error fetching related movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedMovies()
  }, [genre])

  if (loading) {
    return <div>Loading related movies...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Related Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.slice(0, 6).map((movie) => (
          <Card key={movie.imdbID} className="hover:scale-105 transition-transform cursor-pointer" onClick={() => window.location.href = `/movie/${movie.imdbID}`}>
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
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
} 