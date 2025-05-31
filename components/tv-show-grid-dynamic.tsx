"use client"

import { useEffect, useState } from "react"
import { searchMovies, type MovieDetails } from "@/lib/omdb"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TVShowGridDynamicProps {
  genre?: string
  year?: string
  searchQuery?: string
}

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
      // Build search query with type=series parameter
      let query = genre ? `${genre} tv` : "popular tv shows"
      if (year) {
        query += ` ${year}`
      }
      
      // Make multiple searches to get more results
      const searchQueries = [
        query,
        `${query} series`,
        genre ? `${genre} series` : "tv series"
      ]
      
      const allResults: MovieDetails[] = []
      
      for (const searchQuery of searchQueries) {
        const results = await searchMovies(searchQuery, "series")
        // Filter for unique TV series only
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
          <Link key={show.imdbID} href={`/tv-show/${show.imdbID}`}>
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