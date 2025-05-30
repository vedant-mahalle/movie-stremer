"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getMovieById, type MovieDetails } from "@/lib/omdb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Calendar, Award } from "lucide-react"

interface MovieDetailsProps {
  movieId: string
}

export function MovieDetails({ movieId }: MovieDetailsProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        {movie.Poster && movie.Poster !== 'N/A' && (
          <Image
            src={movie.Poster}
            alt={movie.Title}
            fill
            className="object-cover opacity-30"
          />
        )}
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
              <Button size="lg">Watch Now</Button>
              <Button size="lg" variant="outline">Add to List</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 