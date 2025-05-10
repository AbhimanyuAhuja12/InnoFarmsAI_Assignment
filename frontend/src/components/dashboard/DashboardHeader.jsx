import { Link } from "react-router-dom"
import { Sprout, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { ModeToggle } from "../mode-toggle"

export default function DashboardHeader() {
  return (
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
      </div>
    </div>
  )
}
