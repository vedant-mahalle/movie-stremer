"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Info } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=800&width=1400"
          alt="Featured Movie"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-red-600 text-white hover:bg-red-700">
              Featured
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white">
              2024
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white">
              Action
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">Guardians of the Galaxy</h1>

          <p className="text-lg text-gray-200 leading-relaxed">
            A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the
            universe. An epic space adventure filled with humor, heart, and spectacular action sequences.
          </p>

          <div className="flex items-center space-x-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              <Play className="mr-2 h-5 w-5" />
              Play Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Plus className="mr-2 h-5 w-5" />
              My List
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-300">
            <span>⭐ 8.1/10</span>
            <span>2h 1m</span>
            <span>4K Ultra HD</span>
          </div>
        </div>
      </div>
    </section>
  )
}
