"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

interface SearchFiltersProps {
  sortBy: string
  onSortChange: (value: string) => void
  minSeeders: number
  onMinSeedersChange: (value: number) => void
}

export function SearchFilters({
  sortBy,
  onSortChange,
  minSeeders,
  onMinSeedersChange
}: SearchFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Sort By</Label>
            <RadioGroup
              value={sortBy}
              onValueChange={onSortChange}
              className="mt-2 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seeders" id="seeders" />
                <Label htmlFor="seeders">Most Seeders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="date" />
                <Label htmlFor="date">Upload Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="size" id="size" />
                <Label htmlFor="size">Size</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Minimum Seeders: {minSeeders}</Label>
            <Slider
              value={[minSeeders]}
              onValueChange={([value]) => onMinSeedersChange(value)}
              min={0}
              max={1000}
              step={10}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 