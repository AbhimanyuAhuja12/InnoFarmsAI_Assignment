"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Search, Plus, Loader2, Star, Calendar, Sprout, Leaf } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"
import { Slider } from "../components/ui/slider"
import { useToast } from "../components/ui/use-toast"
import { DeleteVarietyDialog } from "../components/DeleteVarietyDialog"
import { ModeToggle } from "../components/mode-toggle"

export default function Dashboard() {
  const [varieties, setVarieties] = useState([])
  const [filteredVarieties, setFilteredVarieties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [healthFilter, setHealthFilter] = useState("")
  const [yieldRange, setYieldRange] = useState([0, 100])
  const [sortOption, setSortOption] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const itemsPerPage = 10

  useEffect(() => {
    fetchVarieties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [varieties, searchQuery, healthFilter, yieldRange, sortOption])

  const fetchVarieties = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/api/varieties")
      setVarieties(response.data)
      setFilteredVarieties(response.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching varieties",
        description: error.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...varieties]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (variety) =>
          variety.cropName.toLowerCase().includes(query) || variety.varietyName.toLowerCase().includes(query),
      )
    }

    // Health rating filter
    if (healthFilter) {
      result = result.filter((variety) => variety.healthRating === Number.parseInt(healthFilter))
    }

    // Yield range filter
    result = result.filter(
      (variety) => variety.expectedYield >= yieldRange[0] && variety.expectedYield <= yieldRange[1],
    )

    // Sorting
    if (sortOption) {
      switch (sortOption) {
        case "yield-asc":
          result.sort((a, b) => a.expectedYield - b.expectedYield)
          break
        case "yield-desc":
          result.sort((a, b) => b.expectedYield - a.expectedYield)
          break
        case "harvest-asc":
          result.sort((a, b) => new Date(a.estimatedHarvestDate) - new Date(b.estimatedHarvestDate))
          break
        case "harvest-desc":
          result.sort((a, b) => new Date(b.estimatedHarvestDate) - new Date(a.estimatedHarvestDate))
          break
        default:
          break
      }
    }

    setFilteredVarieties(result)
    setCurrentPage(1)
  }

  const handleDelete = async (id) => {
    try {
      // Optimistic update
      const updatedVarieties = varieties.filter((variety) => variety.id !== id)
      setVarieties(updatedVarieties)

      await axios.delete(`http://localhost:5000/api/varieties/${id}`)

      toast({
        title: "Variety deleted",
        description: "The crop variety has been successfully removed.",
      })
    } catch (error) {
      // Revert optimistic update
      fetchVarieties()

      toast({
        variant: "destructive",
        title: "Error deleting variety",
        description: error.message || "Something went wrong",
      })
    }
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredVarieties.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredVarieties.length / itemsPerPage)

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />)
      }
    }
    return stars
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            Crop Variety Manager
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track your crop varieties in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link to="/manage">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Variety
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-card dark:bg-card rounded-lg border shadow-sm p-4 md:p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search crop or variety..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Health Rating</label>
            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
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
            <label className="text-sm font-medium mb-1 block">Expected Yield</label>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={yieldRange}
              onValueChange={setYieldRange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{yieldRange[0]} kg</span>
              <span>{yieldRange[1]} kg</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Sort By</label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading varieties...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {currentItems.length > 0 ? (
              currentItems.map((variety) => (
                <Card key={variety.id} className="overflow-hidden transition-all hover:shadow-md dark:border-gray-700">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{variety.varietyName}</h3>
                      <Badge variant="outline" className="mt-1 bg-background dark:bg-card">
                        <Leaf className="mr-1 h-3 w-3" />
                        {variety.cropName}
                      </Badge>
                    </div>
                    <div className="flex">{renderStars(variety.healthRating)}</div>
                  </div>
                  <CardContent className="p-4 md:p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Yield:</span>
                        <span className="font-medium">{variety.expectedYield} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-4 w-4" /> Harvest Date:
                        </span>
                        <span className="font-medium">
                          {new Date(variety.estimatedHarvestDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 dark:bg-muted/20 p-4 flex justify-between">
                    <Link to={`/manage/${variety.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteVarietyDialog varietyName={variety.varietyName} onDelete={() => handleDelete(variety.id)} />
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-muted dark:bg-muted/30 rounded-full p-3 mb-4">
                  <Sprout className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No varieties found</h3>
                <p className="text-muted-foreground mt-1 mb-4">Try adjusting your filters or add a new variety</p>
                <Link to="/manage">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Variety
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {filteredVarieties.length > itemsPerPage && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink isActive={currentPage === pageNum} onClick={() => setCurrentPage(pageNum)}>
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
