"use client"

import { Link } from "react-router-dom"
import { Copy } from "lucide-react"
import { Button } from "../ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { DeleteVarietyDialog } from "../DeleteVarietyDialog"
import { getCropIcon, renderStars, getDaysUntilHarvest, getHarvestStatusBadge } from "../../utils/cropHelpers"

export default function VarietiesList({ varieties, handleDelete, copyVarietyInfo }) {
  return (
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
            {varieties.map((variety) => (
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

                    <DeleteVarietyDialog varietyName={variety.varietyName} onDelete={() => handleDelete(variety.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
