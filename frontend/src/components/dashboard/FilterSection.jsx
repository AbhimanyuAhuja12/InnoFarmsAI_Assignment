"use client"

import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Slider } from "../ui/slider"
import { Separator } from "../ui/separator"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export default function FilterSection({
  searchQuery,
  setSearchQuery,
  healthFilter,
  setHealthFilter,
  yieldRange,
  setYieldRange,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  searchInputRef,
}) {
  return (
    <div className="filter-section">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold flex items-center">
          <Search className="mr-2 h-5 w-5 text-primary" />
          Filter & Sort
        </h2>
        <Tabs defaultValue={viewMode} className="w-full md:w-auto" onValueChange={(value) => setViewMode(value)}>
          <TabsList className="grid w-full md:w-[200px] grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block" htmlFor="search-input">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-input"
              ref={searchInputRef}
              type="text"
              placeholder="Search crop or variety..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search crops or varieties"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Press Ctrl+F to focus search</p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block" id="health-rating-label">
            Health Rating
          </label>
          <Select value={healthFilter} onValueChange={setHealthFilter} aria-labelledby="health-rating-label">
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="any">Any rating</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block" id="yield-range-label">
            Expected Yield
          </label>
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={yieldRange}
            onValueChange={setYieldRange}
            className="py-4"
            aria-labelledby="yield-range-label"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{yieldRange[0]} kg</span>
            <span>{yieldRange[1]} kg</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block" id="sort-by-label">
            Sort By
          </label>
          <Select value={sortOption} onValueChange={setSortOption} aria-labelledby="sort-by-label">
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="yield-asc">Yield (Low to High)</SelectItem>
              <SelectItem value="yield-desc">Yield (High to Low)</SelectItem>
              <SelectItem value="harvest-asc">Harvest Date (Earliest)</SelectItem>
              <SelectItem value="harvest-desc">Harvest Date (Latest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
