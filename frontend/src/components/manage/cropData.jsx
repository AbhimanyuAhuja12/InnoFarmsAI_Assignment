import { Leaf, Droplets, Sun, Wind, CloudRain, SunDim } from "lucide-react"

export const getCropIcons = () => {
  return {
    Lettuce: <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />,
    Spinach: <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />,
    Basil: <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />,
    Tomato: <Sun className="h-5 w-5 text-red-600 dark:text-red-400" />,
    Capsicum: <Sun className="h-5 w-5 text-red-600 dark:text-red-400" />,
    Cucumber: <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    Onion: <SunDim className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
    Carrot: <SunDim className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
    Potato: <SunDim className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
    "Sweet Corn": <Wind className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
    Garlic: <SunDim className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    Beans: <Droplets className="h-5 w-5 text-green-600 dark:text-green-400" />,
    Broccoli: <CloudRain className="h-5 w-5 text-green-600 dark:text-green-400" />,
    Kale: <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />,
    Coriander: <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />,
  }
}
