"use client"

import { useState, useCallback } from "react"
import axios from "axios"
import { format, addDays } from "date-fns"
import { useToast } from "../components/ui/use-toast"

export const useManageVariety = (id, navigate, isEditing) => {
  const { toast } = useToast()

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [formData, setFormData] = useState({
    cropName: "",
    varietyName: "",
    expectedYield: 0,
    sowingDate: format(new Date(), "yyyy-MM-dd"),
    expectedHarvestDays: 60,
    healthRating: 3,
  })
  const [errors, setErrors] = useState({})
  const [estimatedHarvestDate, setEstimatedHarvestDate] = useState("")

  // Calculate estimated harvest date when form data changes
  useState(() => {
    if (formData.sowingDate && formData.expectedHarvestDays) {
      const harvestDate = addDays(new Date(formData.sowingDate), Number.parseInt(formData.expectedHarvestDays))
      setEstimatedHarvestDate(format(harvestDate, "yyyy-MM-dd"))
    }
  }, [formData.sowingDate, formData.expectedHarvestDays])

  const fetchVariety = useCallback(async () => {
    try {
      setLoading(true)
      setApiError(null)
      const response = await axios.get(`http://localhost:5000/api/varieties/${id}`)
      const variety = response.data

      setFormData({
        cropName: variety.cropName,
        varietyName: variety.varietyName,
        expectedYield: variety.expectedYield,
        sowingDate: format(new Date(variety.sowingDate), "yyyy-MM-dd"),
        expectedHarvestDays: variety.expectedHarvestDays,
        healthRating: variety.healthRating,
      })

      // Calculate estimated harvest date
      const harvestDate = addDays(new Date(variety.sowingDate), variety.expectedHarvestDays)
      setEstimatedHarvestDate(format(harvestDate, "yyyy-MM-dd"))
    } catch (error) {
      setApiError("Failed to fetch variety details. Please try again.")
      toast({
        variant: "destructive",
        title: "Error fetching variety",
        description: error.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }

    // Update estimated harvest date if sowing date or expected harvest days change
    if (name === "sowingDate" || name === "expectedHarvestDays") {
      const sowingDate = name === "sowingDate" ? value : formData.sowingDate
      const harvestDays =
        name === "expectedHarvestDays" ? Number.parseInt(value) : Number.parseInt(formData.expectedHarvestDays)

      if (sowingDate && !isNaN(harvestDays)) {
        const harvestDate = addDays(new Date(sowingDate), harvestDays)
        setEstimatedHarvestDate(format(harvestDate, "yyyy-MM-dd"))
      }
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cropName) {
      newErrors.cropName = "Crop name is required"
    }

    if (!formData.varietyName) {
      newErrors.varietyName = "Variety name is required"
    }

    if (formData.expectedYield < 0) {
      newErrors.expectedYield = "Expected yield must be a positive number"
    }

    if (!formData.sowingDate) {
      newErrors.sowingDate = "Sowing date is required"
    }

    if (!formData.expectedHarvestDays || formData.expectedHarvestDays < 1) {
      newErrors.expectedHarvestDays = "Expected harvest days must be at least 1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form",
      })
      return
    }

    try {
      setSubmitting(true)
      setApiError(null)

      const varietyData = {
        ...formData,
        expectedYield: Number.parseFloat(formData.expectedYield),
        expectedHarvestDays: Number.parseInt(formData.expectedHarvestDays),
        healthRating: Number.parseInt(formData.healthRating),
        estimatedHarvestDate,
      }

      if (isEditing) {
        await axios.patch(`http://localhost:5000/api/varieties/${id}`, varietyData)
        toast({
          title: "Variety Updated",
          description: "The crop variety has been successfully updated.",
        })
      } else {
        await axios.post("http://localhost:5000/api/varieties", varietyData)
        toast({
          title: "Variety Added",
          description: "The new crop variety has been successfully added.",
        })
      }

      navigate("/")
    } catch (error) {
      setApiError(
        isEditing ? "Failed to update variety. Please try again." : "Failed to add variety. Please try again.",
      )
      toast({
        variant: "destructive",
        title: isEditing ? "Error updating variety" : "Error adding variety",
        description: error.message || "Something went wrong",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return {
    loading,
    submitting,
    apiError,
    formData,
    errors,
    estimatedHarvestDate,
    handleChange,
    handleSelectChange,
    handleSubmit,
    fetchVariety,
  }
}
