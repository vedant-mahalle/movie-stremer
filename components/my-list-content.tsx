"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MovieCard } from "@/components/movie-card"
import { TVShowCard } from "@/components/tv-show-card"
import { Grid, List, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const myMovies = [
  {
    id: 1,
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    genre: "Action",
    image: "/placeholder.svg?height=400&width=300",
    addedDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Inception",
    year: "2010",
    rating: "8.8",
    genre: "Sci-Fi",
    image: "/placeholder.svg?height=400&width=300",
    addedDate: "2024-01-10",
  },
]

const myTVShows = [
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
    addedDate: "2024-01-12",
  },
]

export function MyListContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")

  const isEmpty = myMovies.length === 0 && myTVShows.length === 0

  if (isEmpty) {
    return (
      <Card className="p-12 text-center">
        <CardContent className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <List className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Your list is empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start building your watchlist by adding movies and TV shows you want to watch later.
          </p>
          <Button>Browse Content</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All ({myMovies.length + myTVShows.length})</TabsTrigger>
            <TabsTrigger value="movies">Movies ({myMovies.length})</TabsTrigger>
            <TabsTrigger value="tv-shows">TV Shows ({myTVShows.length})</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4">
            <Select defaultValue="date-added">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-added">Date Added</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-8">
          {myMovies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Movies</h3>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    : "space-y-4"
                }
              >
                {myMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
                ))}
              </div>
            </div>
          )}

          {myTVShows.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">TV Shows</h3>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    : "space-y-4"
                }
              >
                {myTVShows.map((show) => (
                  <TVShowCard key={show.id} show={show} viewMode={viewMode} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="movies">
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-4"
            }
          >
            {myMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tv-shows">
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-4"
            }
          >
            {myTVShows.map((show) => (
              <TVShowCard key={show.id} show={show} viewMode={viewMode} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
