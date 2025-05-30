"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TVShow {
  id: number
  title: string
  year: string
  rating: string
  genre: string
  seasons: number
  status: string
  network: string
  image: string
  description?: string
}

interface TVShowCardProps {
  show: TVShow
  viewMode?: "grid" | "list"
}

export function TVShowCard({ show, viewMode = "grid" }: TVShowCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative w-32 h-48 flex-shrink-0">
              <Image src={show.image || "/placeholder.svg"} alt={show.title} fill className="object-cover" />
            </div>
            <div className="flex-1 p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/tv-show/${show.id}`}>
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors">{show.title}</h3>
                  </Link>
                  <p className="text-muted-foreground">{show.year}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">⭐ {show.rating}</Badge>
                  <Badge variant="outline">{show.status}</Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>
                  {show.seasons} Season{show.seasons > 1 ? "s" : ""}
                </span>
                <span>{show.genre}</span>
                <span>{show.network}</span>
              </div>

              {show.description && <p className="text-sm text-muted-foreground line-clamp-2">{show.description}</p>}

              <div className="flex items-center space-x-2">
                <Button size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Now
                </Button>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  My List
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className="group relative flex-shrink-0 w-full cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* TV Show Poster */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <Image
          src={show.image || "/placeholder.svg"}
          alt={show.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100",
          )}
        />

        {/* Play Button */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100",
          )}
        >
          <Button size="icon" className="h-12 w-12 rounded-full bg-white text-black hover:bg-gray-200">
            <Play className="h-6 w-6" />
          </Button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/80 text-white">
            ⭐ {show.rating}
          </Badge>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={show.status === "Returning Series" ? "default" : "outline"}
            className="bg-black/80 text-white border-white/20"
          >
            {show.status}
          </Badge>
        </div>
      </div>

      {/* TV Show Info */}
      <div className="mt-3 space-y-2">
        <Link href={`/tv-show/${show.id}`}>
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 hover:text-primary transition-colors">
            {show.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{show.year}</span>
          <Badge variant="outline" className="text-xs">
            {show.genre}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {show.seasons} Season{show.seasons > 1 ? "s" : ""} • {show.network}
        </div>
      </div>

      {/* Hover Actions */}
      <div
        className={cn(
          "absolute -bottom-2 left-0 right-0 opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100",
        )}
      >
        <div className="flex items-center justify-between bg-background/95 backdrop-blur-sm rounded-lg p-3 mx-2 border">
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
