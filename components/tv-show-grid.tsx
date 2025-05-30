"use client"

import { useState } from "react"
import { TVShowCard } from "@/components/tv-show-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List } from "lucide-react"

const tvShows = [
  {
    id: 1,
    title: "Breaking Bad",
    year: "2008-2013",
    rating: "9.5",
    genre: "Crime",
    seasons: 5,
    status: "Ended",
    network: "AMC",
    image: "/placeholder.svg?height=400&width=300",
    description: "A high school chemistry teacher turned methamphetamine producer...",
  },
  {
    id: 2,
    title: "Stranger Things",
    year: "2016-2025",
    rating: "8.7",
    genre: "Sci-Fi",
    seasons: 5,
    status: "Returning Series",
    network: "Netflix",
    image: "/placeholder.svg?height=400&width=300",
    description: "When a young boy disappears, his mother, a police chief and his friends...",
  },
  {
    id: 3,
    title: "The Crown",
    year: "2016-2023",
    rating: "8.6",
    genre: "Drama",
    seasons: 6,
    status: "Ended",
    network: "Netflix",
    image: "/placeholder.svg?height=400&width=300",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign...",
  },
  {
    id: 4,
    title: "Game of Thrones",
    year: "2011-2019",
    rating: "9.2",
    genre: "Fantasy",
    seasons: 8,
    status: "Ended",
    network: "HBO",
    image: "/placeholder.svg?height=400&width=300",
    description: "Nine noble families fight for control over the lands of Westeros...",
  },
  {
    id: 5,
    title: "The Office",
    year: "2005-2013",
    rating: "9.0",
    genre: "Comedy",
    seasons: 9,
    status: "Ended",
    network: "NBC",
    image: "/placeholder.svg?height=400&width=300",
    description: "A mockumentary on a group of typical office workers...",
  },
  {
    id: 6,
    title: "Friends",
    year: "1994-2004",
    rating: "8.9",
    genre: "Comedy",
    seasons: 10,
    status: "Ended",
    network: "NBC",
    image: "/placeholder.svg?height=400&width=300",
    description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends...",
  },
]

export function TVShowGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select defaultValue="24">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TV Shows Grid */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-4"
        }
      >
        {tvShows.map((show) => (
          <TVShowCard key={show.id} show={show} viewMode={viewMode} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 pt-8">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button variant="default">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">...</Button>
        <Button variant="outline">15</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  )
}
