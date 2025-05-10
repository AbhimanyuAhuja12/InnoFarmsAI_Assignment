"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "../ui/button"

export default function ErrorState({ apiError, isEditing, navigate, fetchVariety }) {
  return (
    <div className="min-h-screen flex justify-center items-center p-4" aria-live="polite">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl border shadow-md p-8 backdrop-blur-sm text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-medium">Error</h3>
        <p className="text-muted-foreground mt-2 mb-4">{apiError}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            Return to Dashboard
          </Button>
          {isEditing && <Button onClick={fetchVariety}>Try Again</Button>}
        </div>
      </div>
    </div>
  )
}
