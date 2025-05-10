"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {
  Search,
  Plus,
  Loader2,
  Star,
  Calendar,
  Sprout,
  Leaf,
  Droplets,
  Sun,
  Wind,
  CloudRain,
  Tractor,
  SunDim,
  Copy,
  Undo2,
  AlertCircle,
} from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

export default function Dashboard() {
  const [varieties, setVarieties] = useState([])
  const [filteredVarieties, setFilteredVarieties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [healthFilter, setHealthFilter] = useState("")
  const [yieldRange, setYieldRange] = useState([0, 100])
  const [sortOption, setSortOption] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("grid")
  const [deletedVariety, setDeletedVariety] = useState(null)
  const [apiError, setApiError] = useState(null)
  const { toast } = useToast()
  const searchInputRef = useRef(null)

  // Increase to 10 varieties per page as requested
  const itemsPerPage = 10

  useEffect(() => {
    fetchVarieties()

    // Add keyboard shortcut for search
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [varieties, searchQuery, healthFilter, yieldRange, sortOption])

  const fetchVarieties = async () => {
    try {
      setLoading(true)
      setApiError(null)
      const response = await axios.get("http://localhost:5000/api/varieties")
      setVarieties(response.data)
      setFilteredVarieties(response.data)
    } catch (error) {
      setApiError("Failed to fetch varieties. Please try again.")
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
    if (healthFilter && healthFilter !== "any") {
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
      // Store the variety before deleting for potential undo
      const varietyToDelete = varieties.find((v) => v.id === id)

      // Optimistic update
      const updatedVarieties = varieties.filter((variety) => variety.id !== id)
      setVarieties(updatedVarieties)

      await axios.delete(`http://localhost:5000/api/varieties/${id}`)

      // Store deleted variety for undo functionality
      setDeletedVariety(varietyToDelete)

      toast({
        title: "Variety deleted",
        description: (
          <div className="flex items-center justify-between">
            <span>The crop variety has been removed</span>
            <Button variant="outline" size="sm" onClick={() => handleUndoDelete(varietyToDelete)} className="ml-2">
              <Undo2 className="h-4 w-4 mr-1" /> Undo
            </Button>
          </div>
        ),
        duration: 5000,
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

  const handleUndoDelete = async (variety) => {
    try {
      setLoading(true)
      await axios.post("http://localhost:5000/api/varieties", variety)

      // Refresh varieties
      await fetchVarieties()

      toast({
        title: "Variety restored",
        description: `${variety.varietyName} has been restored successfully.`,
      })

      setDeletedVariety(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error restoring variety",
        description: error.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyVarietyInfo = (variety) => {
    const info = `
Crop: ${variety.cropName}
Variety: ${variety.varietyName}
Expected Yield: ${variety.expectedYield} kg
Health Rating: ${variety.healthRating}/5
Sowing Date: ${new Date(variety.sowingDate).toLocaleDateString()}
Estimated Harvest Date: ${new Date(variety.estimatedHarvestDate).toLocaleDateString()}
Days to Harvest: ${variety.expectedHarvestDays}
    `.trim()

    navigator.clipboard.writeText(info).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Variety information has been copied to clipboard",
        })
      },
      () => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy information to clipboard",
        })
      },
    )
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

  // Get crop icon based on crop name
  const getCropIcon = (cropName) => {
    const cropIcons = {
      Lettuce: <Leaf className="h-4 w-4" />,
      Spinach: <Leaf className="h-4 w-4" />,
      Basil: <Leaf className="h-4 w-4" />,
      Tomato: <Sun className="h-4 w-4" />,
      Capsicum: <Sun className="h-4 w-4" />,
      Cucumber: <Droplets className="h-4 w-4" />,
      Onion: <SunDim className="h-4 w-4" />,
      Carrot: <SunDim className="h-4 w-4" />,
      Potato: <SunDim className="h-4 w-4" />,
      "Sweet Corn": <Wind className="h-4 w-4" />,
      Garlic: <SunDim className="h-4 w-4" />,
      Beans: <Droplets className="h-4 w-4" />,
      Broccoli: <CloudRain className="h-4 w-4" />,
      Kale: <Leaf className="h-4 w-4" />,
      Coriander: <Leaf className="h-4 w-4" />,
    }

    return cropIcons[cropName] || <Leaf className="h-4 w-4" />
  }

  // Get days until harvest
  const getDaysUntilHarvest = (harvestDate) => {
    const today = new Date()
    const harvest = new Date(harvestDate)
    const diffTime = harvest - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get harvest status badge
  const getHarvestStatusBadge = (harvestDate) => {
    const daysUntil = getDaysUntilHarvest(harvestDate)

    if (daysUntil < 0) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          Overdue
        </Badge>
      )
    } else if (daysUntil <= 7) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          Ready Soon
        </Badge>
      )
    } else if (daysUntil <= 30) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          Growing
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Planted
        </Badge>
      )
    }
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="page-header">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 dark:bg-primary/30 p-3 rounded-full">
                  <Sprout className="h-8 w-8 text-primary animate-float" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Crop Variety Manager</h1>
                  <p className="text-muted-foreground mt-1">Cultivate success with smart crop management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Link to="/manage">
                <Button className="shadow-lg hover:shadow-xl transition-all">
                  <Plus className="mr-2 h-4 w-4" /> Add Variety
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-md backdrop-blur-sm border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <Tractor className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Varieties</p>
                  <p className="text-2xl font-bold">{varieties.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-md backdrop-blur-sm border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                  <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ready to Harvest</p>
                  <p className="text-2xl font-bold">
                    {
                      varieties.filter(
                        (v) =>
                          getDaysUntilHarvest(v.estimatedHarvestDate) <= 7 &&
                          getDaysUntilHarvest(v.estimatedHarvestDate) >= 0,
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-md backdrop-blur-sm border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Growing</p>
                  <p className="text-2xl font-bold">
                    {
                      varieties.filter(
                        (v) =>
                          getDaysUntilHarvest(v.estimatedHarvestDate) > 7 &&
                          getDaysUntilHarvest(v.estimatedHarvestDate) <= 30,
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-md backdrop-blur-sm border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">
                    {varieties.filter((v) => getDaysUntilHarvest(v.estimatedHarvestDate) < 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="filter-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold flex items-center">
              <Search className="mr-2 h-5 w-5 text-primary" />
              Filter & Sort
            </h2>
            <Tabs defaultValue="grid" className="w-full md:w-auto" onValueChange={(value) => setViewMode(value)}>
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

        {loading ? (
          <div
            className="flex flex-col justify-center items-center h-64 bg-white/50 dark:bg-gray-800/50 rounded-xl border shadow-sm p-8 backdrop-blur-sm"
            aria-live="polite"
            aria-busy="true"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <span className="text-lg">Loading your crop varieties...</span>
            <p className="text-muted-foreground mt-2">Preparing your agricultural data</p>
          </div>
        ) : apiError ? (
          <div
            className="flex flex-col justify-center items-center h-64 bg-white/50 dark:bg-gray-800/50 rounded-xl border shadow-sm p-8 backdrop-blur-sm"
            aria-live="polite"
          >
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <span className="text-lg font-medium">Error Loading Data</span>
            <p className="text-muted-foreground mt-2 mb-4">{apiError}</p>
            <Button onClick={fetchVarieties}>
              <Undo2 className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        ) : (
          <Tabs value={viewMode} className="w-full">
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentItems.length > 0 ? (
                  currentItems.map((variety) => (
                    <Card key={variety.id} className="dashboard-card group" tabIndex="0">
                      <div className="dashboard-card-header">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {variety.varietyName}
                          </h3>
                          <Badge variant="outline" className="mt-1 bg-background/80 dark:bg-card/80 backdrop-blur-sm">
                            {getCropIcon(variety.cropName)}
                            <span className="ml-1">{variety.cropName}</span>
                          </Badge>
                        </div>
                        <div className="flex">{renderStars(variety.healthRating)}</div>
                      </div>
                      <CardContent className="dashboard-card-content">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Expected Yield:</span>
                            <Badge variant="secondary" className="font-medium text-sm">
                              {variety.expectedYield} kg
                            </Badge>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center">
                              <Calendar className="mr-1 h-4 w-4" /> Harvest:
                            </span>
                            <div className="text-right">
                              <div className="font-medium text-sm">
                                {new Date(variety.estimatedHarvestDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {getDaysUntilHarvest(variety.estimatedHarvestDate) >= 0
                                  ? `${getDaysUntilHarvest(variety.estimatedHarvestDate)} days remaining`
                                  : `${Math.abs(getDaysUntilHarvest(variety.estimatedHarvestDate))} days overdue`}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">{getHarvestStatusBadge(variety.estimatedHarvestDate)}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="dashboard-card-footer">
                        <div className="flex w-full gap-2">
                          <Link to={`/manage/${variety.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              Edit
                            </Button>
                          </Link>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyVarietyInfo(variety)}
                                  aria-label="Copy variety information"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy variety info</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DeleteVarietyDialog
                            varietyName={variety.varietyName}
                            onDelete={() => handleDelete(variety.id)}
                          />
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center h-64 text-center bg-white/50 dark:bg-gray-800/50 rounded-xl border shadow-sm p-8 backdrop-blur-sm">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                      <Sprout className="h-8 w-8 text-primary animate-float" />
                    </div>
                    <h3 className="text-xl font-medium">No varieties found</h3>
                    <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                      It looks like your garden is empty. Try adjusting your filters or plant a new variety to get
                      started.
                    </p>
                    <Link to="/manage">
                      <Button className="shadow-lg hover:shadow-xl transition-all">
                        <Plus className="mr-2 h-4 w-4" /> Plant New Variety
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl border shadow-sm overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full" role="grid" aria-label="Crop varieties">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium" scope="col">
                          Variety
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium" scope="col">
                          Crop
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium" scope="col">
                          Health
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium" scope="col">
                          Yield
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium" scope="col">
                          Harvest Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium" scope="col">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium" scope="col">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {currentItems.length > 0 ? (
                        currentItems.map((variety) => (
                          <tr key={variety.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium">{variety.varietyName}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center">
                                {getCropIcon(variety.cropName)}
                                <span className="ml-2">{variety.cropName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex">{renderStars(variety.healthRating)}</div>
                            </td>
                            <td className="px-4 py-3 text-sm">{variety.expectedYield} kg</td>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                {new Date(variety.estimatedHarvestDate).toLocaleDateString()}
                                <div className="text-xs text-muted-foreground">
                                  {getDaysUntilHarvest(variety.estimatedHarvestDate) >= 0
                                    ? `${getDaysUntilHarvest(variety.estimatedHarvestDate)} days remaining`
                                    : `${Math.abs(getDaysUntilHarvest(variety.estimatedHarvestDate))} days overdue`}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">{getHarvestStatusBadge(variety.estimatedHarvestDate)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <div className="flex justify-end gap-2">
                                <Link to={`/manage/${variety.id}`}>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </Link>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyVarietyInfo(variety)}
                                        aria-label="Copy variety information"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Copy variety info</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <DeleteVarietyDialog
                                  varietyName={variety.varietyName}
                                  onDelete={() => handleDelete(variety.id)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="bg-primary/10 rounded-full p-3 mb-3">
                                <Sprout className="h-6 w-6 text-primary" />
                              </div>
                              <p className="text-muted-foreground mb-4">No varieties found</p>
                              <Link to="/manage">
                                <Button size="sm">
                                  <Plus className="mr-2 h-4 w-4" /> Add Variety
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {filteredVarieties.length > itemsPerPage && (
          <Pagination className="mt-8" aria-label="Pagination">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="hover:bg-muted/70 transition-colors"
                  aria-label="Go to previous page"
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
                    <PaginationLink
                      isActive={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className="hover:bg-muted/70 transition-colors"
                      aria-label={`Page ${pageNum}`}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="hover:bg-muted/70 transition-colors"
                  aria-label="Go to next page"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
