"use client"

import { useState } from "react"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List } from "lucide-react"

const movies = [
  {
    id: 1,
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    genre: "Action",
    image: "/placeholder.svg?height=400&width=300",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
  },
  {
    id: 2,
    title: "Inception",
    year: "2010",
    rating: "8.8",
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=400&width=300",
    description: "A thief who steals corporate secrets through dream-sharing technology...",
  },
  {
    id: 3,
    title: "Interstellar",
    year: "2014",
    rating: "8.6",
    genre: "Drama",
    image: "/placeholder.svg?height=400&width=300",
    description: "A team of explorers travel through a wormhole in space...",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: "1994",
    rating: "8.9",
    genre: "Crime",
    image: "/placeholder.svg?height=400&width=300",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife...",
  },
  {
    id: 5,
    title: "The Matrix",
    year: "1999",
    rating: "8.7",
    genre: "Action",
    image: "/placeholder.svg?height=400&width=300",
    description: "A computer programmer is led to fight an underground war...",
  },
  {
    id: 6,
    title: "Forrest Gump",
    year: "1994",
    rating: "8.8",
    genre: "Drama",
    image: "/placeholder.svg?height=400&width=300",
    description: "The presidencies of Kennedy and Johnson through the eyes of an Alabama man...",
  },
  {
    id: 7,
    title: "The Godfather",
    year: "1972",
    rating: "9.2",
    genre: "Crime",
    image: "/placeholder.svg?height=400&width=300",
    description: "The aging patriarch of an organized crime dynasty transfers control...",
  },
  {
    id: 8,
    title: "Schindler's List",
    year: "1993",
    rating: "9.0",
    genre: "Drama",
    image: "/placeholder.svg?height=400&width=300",
    description: "In German-occupied Poland during World War II...",
  },
]

export function MovieGrid() {
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

      {/* Movies Grid */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-4"
        }
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
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
        <Button variant="outline">24</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  )
}
