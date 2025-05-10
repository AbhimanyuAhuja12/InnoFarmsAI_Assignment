import { Loader2 } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="min-h-screen flex justify-center items-center p-4" aria-live="polite" aria-busy="true">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl border shadow-md p-8 backdrop-blur-sm text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-xl font-medium">Loading variety data...</h3>
        <p className="text-muted-foreground mt-2">Retrieving your crop information</p>
      </div>
    </div>
  )
}
