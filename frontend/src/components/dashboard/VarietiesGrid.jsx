"use client"

import { Link } from "react-router-dom"
import { Calendar, Copy } from "lucide-react"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { DeleteVarietyDialog } from "../DeleteVarietyDialog"
import { getCropIcon, renderStars, getDaysUntilHarvest, getHarvestStatusBadge } from "../../utils/cropHelpers"

export default function VarietiesGrid({ varieties, handleDelete, copyVarietyInfo }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {varieties.map((variety) => (
        <Card key={variety.id} className="dashboard-card group" tabIndex="0">
          <div className="dashboard-card-header">
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{variety.varietyName}</h3>
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

              <DeleteVarietyDialog varietyName={variety.varietyName} onDelete={() => handleDelete(variety.id)} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
