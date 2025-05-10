"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { format, addDays } from "date-fns"
import {
  Loader2,
  ArrowLeft,
  Sprout,
  Calendar,
  Star,
  Leaf,
  Droplets,
  SunDim,
  CloudRain,
  Wind,
  Sun,
  Tractor,
  SproutIcon as SeedingIcon,
  Thermometer,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useToast } from "../components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { ModeToggle } from "../components/mode-toggle"

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

  // Crop icon mapping
  const cropIcons = {
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
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl border shadow-md p-8 backdrop-blur-sm text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium">Loading variety data...</h3>
          <p className="text-muted-foreground mt-2">Retrieving your crop information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="page-header">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors">
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

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <Card className="form-card shadow-xl border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/20 border-b">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              {isEditing ? "Edit" : "Add New"} Variety
            </CardTitle>
            <CardDescription className="text-base">
              {isEditing
                ? "Update the details of your existing crop variety"
                : "Fill in the details to add a new crop variety to your collection"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cropName" className="text-base">
                    Crop Name
                  </Label>
                  <Select value={formData.cropName} onValueChange={(value) => handleSelectChange("cropName", value)}>
                    <SelectTrigger id="cropName" className={`${errors.cropName ? "border-destructive" : ""} h-12`}>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropOptions.map((crop) => (
                        <SelectItem key={crop} value={crop} className="flex items-center">
                          <div className="flex items-center">
                            {cropIcons[crop]}
                            <span className="ml-2">{crop}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cropName && <p className="text-sm text-destructive">{errors.cropName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="varietyName" className="text-base">
                    Variety Name
                  </Label>
                  <Input
                    id="varietyName"
                    name="varietyName"
                    value={formData.varietyName}
                    onChange={handleChange}
                    className={`${errors.varietyName ? "border-destructive" : ""} h-12`}
                  />
                  {errors.varietyName && <p className="text-sm text-destructive">{errors.varietyName}</p>}
                </div>
              </div>

              <div className="bg-secondary/30 dark:bg-secondary/10 rounded-xl p-5 border border-secondary/30">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Thermometer className="mr-2 h-5 w-5 text-primary" />
                  Growth Parameters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedYield" className="text-base">
                      Expected Yield (kg)
                    </Label>
                    <Input
                      id="expectedYield"
                      name="expectedYield"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.expectedYield}
                      onChange={handleChange}
                      className={`${errors.expectedYield ? "border-destructive" : ""} h-12`}
                    />
                    {errors.expectedYield && <p className="text-sm text-destructive">{errors.expectedYield}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="healthRating" className="text-base">
                      Health Rating
                    </Label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border p-3 h-12 flex items-center">
                      <RadioGroup
                        id="healthRating"
                        value={formData.healthRating.toString()}
                        onValueChange={(value) => handleSelectChange("healthRating", value)}
                        className="flex space-x-4"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <div key={rating} className="flex items-center space-x-1">
                            <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                            <Label htmlFor={`rating-${rating}`} className="flex items-center">
                              <Star
                                className={`h-5 w-5 ${
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
                </div>
              </div>

              <div className="bg-primary/10 dark:bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Planting Schedule
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sowingDate" className="text-base">
                      Sowing Date
                    </Label>
                    <Input
                      id="sowingDate"
                      name="sowingDate"
                      type="date"
                      value={formData.sowingDate}
                      onChange={handleChange}
                      className={`${errors.sowingDate ? "border-destructive" : ""} h-12`}
                    />
                    {errors.sowingDate && <p className="text-sm text-destructive">{errors.sowingDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedHarvestDays" className="text-base">
                      Expected Harvest Days
                    </Label>
                    <Input
                      id="expectedHarvestDays"
                      name="expectedHarvestDays"
                      type="number"
                      min="1"
                      value={formData.expectedHarvestDays}
                      onChange={handleChange}
                      className={`${errors.expectedHarvestDays ? "border-destructive" : ""} h-12`}
                    />
                    {errors.expectedHarvestDays && (
                      <p className="text-sm text-destructive">{errors.expectedHarvestDays}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-primary/20 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-primary/20 dark:bg-primary/30 p-2 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Estimated Harvest Date</p>
                      <p className="text-muted-foreground">Based on sowing date and expected growth period</p>
                    </div>
                  </div>
                  <div className="text-right bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg border shadow-sm backdrop-blur-sm">
                    <p className="text-xl font-bold text-primary">
                      {estimatedHarvestDate && format(new Date(estimatedHarvestDate), "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {estimatedHarvestDate && `${formData.expectedHarvestDays} days after planting`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between p-6 bg-muted/30 border-t">
              <Button variant="outline" type="button" onClick={() => navigate("/")} className="w-full sm:w-auto h-12">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg"
              >
                {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isEditing ? "Update" : "Plant"} Variety
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
