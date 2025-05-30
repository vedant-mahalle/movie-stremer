"use client"

import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

interface MovieGridProps {
  title: string
}

const movies = [
  {
    id: 1,
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    genre: "Action",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    title: "Inception",
    year: "2010",
    rating: "8.8",
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    title: "Interstellar",
    year: "2014",
    rating: "8.6",
    genre: "Drama",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: "1994",
    rating: "8.9",
    genre: "Crime",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 5,
    title: "The Matrix",
    year: "1999",
    rating: "8.7",
    genre: "Action",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 6,
    title: "Forrest Gump",
    year: "1994",
    rating: "8.8",
    genre: "Drama",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export function MovieGrid({ title }: MovieGridProps) {
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

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
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
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
