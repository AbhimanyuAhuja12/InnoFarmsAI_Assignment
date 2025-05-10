import { Tractor, Sun, Droplets, Calendar } from "lucide-react"

export default function DashboardStats({ varieties }) {
  // Get days until harvest
  const getDaysUntilHarvest = (harvestDate) => {
    const today = new Date()
    const harvest = new Date(harvestDate)
    const diffTime = harvest - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
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
  )
}
