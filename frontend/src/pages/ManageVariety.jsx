"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { format, addDays } from "date-fns"
import { Loader2, ArrowLeft, Sprout, Calendar, Star } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useToast } from "../components/ui/use-toast"
import { Separator } from "../components/ui/separator"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"

export default function ManageVariety() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditing = !!id

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
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

  // Crop options for the select dropdown
  const cropOptions = [
    "Lettuce",
    "Spinach",
    "Basil",
    "Tomato",
    "Capsicum",
    "Cucumber",
    "Onion",
    "Carrot",
    "Potato",
    "Sweet Corn",
    "Garlic",
    "Beans",
    "Broccoli",
    "Kale",
    "Coriander",
  ]

  useEffect(() => {
    if (isEditing) {
      fetchVariety()
    }
  }, [id])

  useEffect(() => {
    // Calculate estimated harvest date
    if (formData.sowingDate && formData.expectedHarvestDays) {
      const harvestDate = addDays(new Date(formData.sowingDate), Number.parseInt(formData.expectedHarvestDays))
      setEstimatedHarvestDate(format(harvestDate, "yyyy-MM-dd"))
    }
  }, [formData.sowingDate, formData.expectedHarvestDays])

  const fetchVariety = async () => {
    try {
      setLoading(true)
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching variety",
        description: error.message || "Something went wrong",
      })
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

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
      toast({
        variant: "destructive",
        title: isEditing ? "Error updating variety" : "Error adding variety",
        description: error.message || "Something went wrong",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading variety data...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto shadow-md dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sprout className="h-5 w-5" />
            {isEditing ? "Edit" : "Add New"} Variety
          </div>
          <CardTitle className="text-2xl">{isEditing ? "Update Crop Variety" : "Add New Crop Variety"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the details of your existing crop variety"
              : "Fill in the details to add a new crop variety to your collection"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="cropName">Crop Name</Label>
                <Select value={formData.cropName} onValueChange={(value) => handleSelectChange("cropName", value)}>
                  <SelectTrigger id="cropName" className={errors.cropName ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropOptions.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cropName && <p className="text-sm text-destructive">{errors.cropName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="varietyName">Variety Name</Label>
                <Input
                  id="varietyName"
                  name="varietyName"
                  value={formData.varietyName}
                  onChange={handleChange}
                  className={errors.varietyName ? "border-destructive" : ""}
                />
                {errors.varietyName && <p className="text-sm text-destructive">{errors.varietyName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="expectedYield">Expected Yield (kg)</Label>
                <Input
                  id="expectedYield"
                  name="expectedYield"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.expectedYield}
                  onChange={handleChange}
                  className={errors.expectedYield ? "border-destructive" : ""}
                />
                {errors.expectedYield && <p className="text-sm text-destructive">{errors.expectedYield}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthRating">Health Rating</Label>
                <RadioGroup
                  id="healthRating"
                  value={formData.healthRating.toString()}
                  onValueChange={(value) => handleSelectChange("healthRating", value)}
                  className="flex space-x-2"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-1">
                      <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                      <Label htmlFor={`rating-${rating}`} className="flex items-center">
                        <Star
                          className={`h-4 w-4 ${
                            rating <= formData.healthRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="sowingDate">Sowing Date</Label>
                <Input
                  id="sowingDate"
                  name="sowingDate"
                  type="date"
                  value={formData.sowingDate}
                  onChange={handleChange}
                  className={errors.sowingDate ? "border-destructive" : ""}
                />
                {errors.sowingDate && <p className="text-sm text-destructive">{errors.sowingDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedHarvestDays">Expected Harvest Days</Label>
                <Input
                  id="expectedHarvestDays"
                  name="expectedHarvestDays"
                  type="number"
                  min="1"
                  value={formData.expectedHarvestDays}
                  onChange={handleChange}
                  className={errors.expectedHarvestDays ? "border-destructive" : ""}
                />
                {errors.expectedHarvestDays && <p className="text-sm text-destructive">{errors.expectedHarvestDays}</p>}
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Estimated Harvest Date</p>
                  <p className="text-sm text-muted-foreground">Based on sowing date and expected harvest days</p>
                </div>
              </div>
              <div className="text-right w-full sm:w-auto">
                <p className="font-medium">{estimatedHarvestDate}</p>
                <p className="text-xs text-muted-foreground">
                  {estimatedHarvestDate && format(new Date(estimatedHarvestDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/")} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Add"} Variety
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
