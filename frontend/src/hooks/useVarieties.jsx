"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export const useVarieties = (toast) => {
  const [varieties, setVarieties] = useState([])
  const [filteredVarieties, setFilteredVarieties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [healthFilter, setHealthFilter] = useState("")
  const [yieldRange, setYieldRange] = useState([0, 100])
  const [sortOption, setSortOption] = useState("")
  const [deletedVariety, setDeletedVariety] = useState(null)
  const [apiError, setApiError] = useState(null)

  // Set to 10 varieties per page as requested
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
            <button
              onClick={() => handleUndoDelete(varietyToDelete)}
              className="ml-2 px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Undo
            </button>
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

  return {
    varieties,
    filteredVarieties,
    loading,
    apiError,
    searchQuery,
    setSearchQuery,
    healthFilter,
    setHealthFilter,
    yieldRange,
    setYieldRange,
    sortOption,
    setSortOption,
    fetchVarieties,
    handleDelete,
    handleUndoDelete,
    copyVarietyInfo,
    itemsPerPage,
  }
}
