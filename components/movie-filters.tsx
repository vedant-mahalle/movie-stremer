"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function MovieFilters() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [yearRange, setYearRange] = useState([1990, 2024])
  const [ratingRange, setRatingRange] = useState([0, 10])

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ]

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setYearRange([1990, 2024])
    setRatingRange([0, 10])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Active Filters */}
      {selectedGenres.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <Badge key={genre} variant="secondary" className="cursor-pointer">
                {genre}
                <X className="ml-1 h-3 w-3" onClick={() => toggleGenre(genre)} />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Sort By */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="popularity">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="release_date">Release Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Genres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Genres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {genres.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={genre}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
              />
              <Label htmlFor={genre} className="text-sm cursor-pointer">
                {genre}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Release Year */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Release Year</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={yearRange} onValueChange={setYearRange} min={1950} max={2024} step={1} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={ratingRange} onValueChange={setRatingRange} min={0} max={10} step={0.1} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{ratingRange[0]}</span>
            <span>{ratingRange[1]}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
