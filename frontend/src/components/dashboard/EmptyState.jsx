import { Link } from "react-router-dom"
import { Sprout, Plus } from "lucide-react"
import { Button } from "../ui/button"

export default function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center h-64 text-center bg-white/50 dark:bg-gray-800/50 rounded-xl border shadow-sm p-8 backdrop-blur-sm">
      <div className="bg-primary/10 rounded-full p-4 mb-4">
        <Sprout className="h-8 w-8 text-primary animate-float" />
      </div>
      <h3 className="text-xl font-medium">No varieties found</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md">
        It looks like your garden is empty. Try adjusting your filters or plant a new variety to get started.
      </p>
      <Link to="/manage">
        <Button className="shadow-lg hover:shadow-xl transition-all">
          <Plus className="mr-2 h-4 w-4" /> Plant New Variety
        </Button>
      </Link>
    </div>
  )
}
