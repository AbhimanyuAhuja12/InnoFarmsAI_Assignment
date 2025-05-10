"use client"

import { useState, useEffect, useRef } from "react"
import DashboardHeader from "../components/dashboard/DashboardHeader"
import DashboardStats from "../components/dashboard/DashboardStats"
import FilterSection from "../components/dashboard/FilterSection"
import VarietiesList from "../components/dashboard/VarietiesList"
import VarietiesGrid from "../components/dashboard/VarietiesGrid"
import EmptyState from "../components/dashboard/EmptyState"
import PaginationControls from "../components/dashboard/PaginationControls"
import { useToast } from "../components/ui/use-toast"
import { useVarieties } from "../hooks/useVarieties"
import { Loader2, AlertCircle, Undo2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent } from "../components/ui/tabs"

export default function Dashboard() {
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const searchInputRef = useRef(null)
  const { toast } = useToast()

  const {
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
  } = useVarieties(toast)

  useEffect(() => {
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredVarieties.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredVarieties.length / itemsPerPage)

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center p-4 bg-background"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <span className="text-lg">Loading your crop varieties...</span>
        <p className="text-muted-foreground mt-2">Preparing your agricultural data</p>
      </div>
    )
  }

  if (apiError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background" aria-live="polite">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <span className="text-lg font-medium">Error Loading Data</span>
        <p className="text-muted-foreground mt-2 mb-4">{apiError}</p>
        <Button onClick={fetchVarieties}>
          <Undo2 className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      <DashboardHeader />

      <div className="container mx-auto px-4">
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          healthFilter={healthFilter}
          setHealthFilter={setHealthFilter}
          yieldRange={yieldRange}
          setYieldRange={setYieldRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchInputRef={searchInputRef}
        />

        <DashboardStats varieties={varieties} />

        <Tabs value={viewMode} className="w-full">
          <TabsContent value="grid" className="mt-0">
            {currentItems.length > 0 ? (
              <VarietiesGrid varieties={currentItems} handleDelete={handleDelete} copyVarietyInfo={copyVarietyInfo} />
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            {currentItems.length > 0 ? (
              <VarietiesList varieties={currentItems} handleDelete={handleDelete} copyVarietyInfo={copyVarietyInfo} />
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>

        {filteredVarieties.length > itemsPerPage && (
          <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        )}
      </div>
    </div>
  )
}
