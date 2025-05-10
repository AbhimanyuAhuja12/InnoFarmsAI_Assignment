import { Link } from "react-router-dom"
import { ArrowLeft, Tractor, SproutIcon as SeedingIcon } from "lucide-react"
import { ModeToggle } from "../mode-toggle"

export default function ManageVarietyHeader({ isEditing }) {
  return (
    <div className="page-header">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Link>
          <ModeToggle />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="bg-primary/20 dark:bg-primary/30 p-3 rounded-full">
            {isEditing ? (
              <Tractor className="h-8 w-8 text-primary animate-float" />
            ) : (
              <SeedingIcon className="h-8 w-8 text-primary animate-float" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Update Crop Variety" : "Plant New Variety"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing
                ? "Refine your crop details for better harvest planning"
                : "Add a new crop variety to your agricultural collection"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
