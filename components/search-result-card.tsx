"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Film, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRef } from "react"
import Image from "next/image"

interface MovieInfo {
  title: string
  year: string
  poster: string
  plot: string
  rating: string
  genre: string
}

interface SearchResultCardProps {
  name: string
  size: string
  seeders: number
  leechers: number
  uploadDate: string
  magnet: string
  movieInfo: MovieInfo | null
  onDownload: (magnet: string) => void
}

export function SearchResultCard({
  name,
  size,
  seeders,
  leechers,
  uploadDate,
  magnet,
  movieInfo,
  onDownload
}: SearchResultCardProps) {
  return (
    <Card className="overflow-hidden w-64 flex-shrink-0 bg-card text-card-foreground shadow-lg">
      <CardContent className="p-3 flex flex-col h-full">
        <div className="relative flex items-center justify-center h-80 bg-muted rounded-md mb-3 overflow-hidden">
          {movieInfo?.poster && movieInfo.poster !== 'N/A' ? (
            <Image
              src={movieInfo.poster}
              alt={movieInfo.title}
              fill
              className="object-cover"
            />
          ) : (
            <Film className="h-20 w-20 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 text-foreground">
            {movieInfo?.title || name}
          </h3>

          {movieInfo && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{movieInfo.year}</span>
                {movieInfo.rating !== 'N/A' && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{movieInfo.rating}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{movieInfo.plot}</p>
              <div className="flex flex-wrap gap-1">
                {movieInfo.genre.split(', ').map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </>
          )}

          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Size:</span>
              <span className="text-foreground font-medium">{size}</span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span>Upload:</span>
              <span className="text-foreground font-medium">{uploadDate}</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="secondary" className="text-green-500 bg-green-500/20 px-2 py-0.5">
                {seeders} Seeders
              </Badge>
              <Badge variant="secondary" className="text-red-500 bg-red-500/20 px-2 py-0.5">
                {leechers} Leechers
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Button
          className="w-full flex items-center justify-center"
          onClick={() => onDownload(magnet)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

interface SearchResultsGridProps {
  title: string
  results: {
    name: string
    size: string
    seeders: number
    leechers: number
    uploadDate: string
    magnet: string
    movieInfo: MovieInfo | null
  }[]
  onDownload: (magnet: string) => void
}

export function SearchResultsGrid({ title, results, onDownload }: SearchResultsGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (!results.length) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {results.map((result, index) => (
          <SearchResultCard
            key={index}
            {...result}
            onDownload={onDownload}
          />
        ))}
      </div>
    </section>
  )
}