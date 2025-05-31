"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface Movie {
  Title: string
  Year: string
  imdbRating: string
  Genre: string
  Poster: string
  imdbID: string
  magnet?: string
}

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.Poster && movie.Poster !== 'N/A'
    ? movie.Poster
    : `https://placehold.co/300x450/1e293b/e2e8f0?text=${encodeURIComponent(movie.Title)}`

  return (
    <Link href={`/search?movie=${encodeURIComponent(movie.Title)}`} passHref>
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl flex flex-col min-w-[240px] cursor-pointer">
        <div className="relative aspect-[2/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt={`${movie.Title} Poster`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.src = `https://placehold.co/300x450/1e293b/e2e8f0?text=${encodeURIComponent(movie.Title)}`
            }}
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{movie.Title}</h3>
            <p className="text-gray-400 text-sm">{movie.Year}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-yellow-400 text-sm">⭐ {movie.imdbRating}</span>
            <span className="text-gray-400 text-sm">{movie.Genre?.split(', ')[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
