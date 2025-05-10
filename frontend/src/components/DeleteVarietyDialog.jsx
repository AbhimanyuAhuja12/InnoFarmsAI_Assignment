"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

export function DeleteVarietyDialog({ varietyName, onDelete }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete()
    setIsDeleting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="shadow-sm hover:shadow-md transition-all">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:border-gray-700 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="font-semibold">Confirm Deletion</span>
          </div>
          <DialogTitle className="text-xl">Delete {varietyName}?</DialogTitle>
          <DialogDescription className="text-base">
            This action cannot be undone. This will permanently delete the crop variety from your collection.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="sm:w-32">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="sm:w-32 bg-gradient-to-r from-destructive to-destructive/80"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
