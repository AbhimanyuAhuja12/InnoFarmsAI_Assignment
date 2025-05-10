import { Star, Leaf, Droplets, Sun, Wind, CloudRain, SunDim } from "lucide-react"
import { Badge } from "../components/ui/badge"

// Render stars for health rating
export const renderStars = (rating) => {
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
export const getCropIcon = (cropName) => {
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
export const getDaysUntilHarvest = (harvestDate) => {
  const today = new Date()
  const harvest = new Date(harvestDate)
  const diffTime = harvest - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Get harvest status badge
export const getHarvestStatusBadge = (harvestDate) => {
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
