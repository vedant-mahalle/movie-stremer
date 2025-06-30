"use client"

import { useEffect, useState } from "react"
import { searchMovies, type MovieDetails } from "@/lib/omdb"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

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
          <Link key={movie.imdbID} href={`/movie/${movie.imdbID}`}>
            <Card className="hover:scale-105 transition-transform">
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
                </div>
              </CardContent>
            </Card>
          </Link>
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