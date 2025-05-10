"use client";

import { format } from "date-fns";
import { Sprout, Calendar, Thermometer, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { getCropIcons } from "./cropData";

export default function VarietyForm({
  isEditing,
  formData,
  errors,
  estimatedHarvestDate,
  handleChange,
  handleSelectChange,
  handleSubmit,
  submitting,
  navigate,
}) {
  const cropIcons = getCropIcons();
  const cropOptions = Object.keys(cropIcons);

  return (
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

      <form
        onSubmit={handleSubmit}
        aria-label={isEditing ? "Edit variety form" : "Add variety form"}
      >
        <CardContent className="space-y-8 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cropName" className="text-base font-medium">
                Crop Name
              </Label>
              <Select
                value={formData.cropName}
                onValueChange={(value) => handleSelectChange("cropName", value)}
                name="cropName"
                aria-invalid={!!errors.cropName}
                aria-describedby={
                  errors.cropName ? "cropName-error" : undefined
                }
              >
                <SelectTrigger
                  id="cropName"
                  className={`${
                    errors.cropName ? "border-destructive" : "border-gray-300"
                  } h-12 bg-white shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary`}
                >
                  <SelectValue
                    placeholder="Select crop"
                    className="text-gray-900"
                  />
                </SelectTrigger>
                <SelectContent
                  position="item-aligned"
                  className="bg-white border border-gray-200 shadow-lg"
                >
                  {cropOptions.map((crop) => (
                    <SelectItem
                      key={crop}
                      value={crop}
                      className="flex items-center py-2 px-2 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <span className="text-primary-500">
                          {cropIcons[crop]}
                        </span>
                        <span className="ml-2 text-gray-900 font-medium">
                          {crop}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cropName && (
                <p
                  className="text-sm text-destructive font-medium mt-1"
                  id="cropName-error"
                  aria-live="polite"
                >
                  {errors.cropName}
                </p>
              )}
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
                className={`${
                  errors.varietyName ? "border-destructive" : ""
                } h-12`}
                aria-invalid={!!errors.varietyName}
                aria-describedby={
                  errors.varietyName ? "varietyName-error" : undefined
                }
              />
              {errors.varietyName && (
                <p
                  className="text-sm text-destructive"
                  id="varietyName-error"
                  aria-live="polite"
                >
                  {errors.varietyName}
                </p>
              )}
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
                  className={`${
                    errors.expectedYield ? "border-destructive" : ""
                  } h-12`}
                  aria-invalid={!!errors.expectedYield}
                  aria-describedby={
                    errors.expectedYield ? "expectedYield-error" : undefined
                  }
                />
                {errors.expectedYield && (
                  <p
                    className="text-sm text-destructive"
                    id="expectedYield-error"
                    aria-live="polite"
                  >
                    {errors.expectedYield}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthRating" className="text-base">
                  Health Rating
                </Label>
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-3 h-12 flex items-center">
                  <RadioGroup
                    id="healthRating"
                    value={formData.healthRating.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("healthRating", value)
                    }
                    className="flex space-x-4"
                    aria-label="Health rating from 1 to 5 stars"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-1">
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`rating-${rating}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="flex items-center cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`h-5 w-5 transition-all ${
                              rating <= formData.healthRating
                                ? "fill-yellow-400 text-yellow-400 scale-110"
                                : "text-muted-foreground hover:text-yellow-400 hover:scale-105"
                            }`}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
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
                  className={`${
                    errors.sowingDate ? "border-destructive" : ""
                  } h-12`}
                  aria-invalid={!!errors.sowingDate}
                  aria-describedby={
                    errors.sowingDate ? "sowingDate-error" : undefined
                  }
                />
                {errors.sowingDate && (
                  <p
                    className="text-sm text-destructive"
                    id="sowingDate-error"
                    aria-live="polite"
                  >
                    {errors.sowingDate}
                  </p>
                )}
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
                  className={`${
                    errors.expectedHarvestDays ? "border-destructive" : ""
                  } h-12`}
                  aria-invalid={!!errors.expectedHarvestDays}
                  aria-describedby={
                    errors.expectedHarvestDays
                      ? "expectedHarvestDays-error"
                      : undefined
                  }
                />
                {errors.expectedHarvestDays && (
                  <p
                    className="text-sm text-destructive"
                    id="expectedHarvestDays-error"
                    aria-live="polite"
                  >
                    {errors.expectedHarvestDays}
                  </p>
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
                  <p className="text-muted-foreground">
                    Based on sowing date and expected growth period
                  </p>
                </div>
              </div>
              <div className="text-right bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg border shadow-sm backdrop-blur-sm">
                <p className="text-xl font-bold text-primary">
                  {estimatedHarvestDate &&
                    format(new Date(estimatedHarvestDate), "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {estimatedHarvestDate &&
                    `${formData.expectedHarvestDays} days after planting`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between p-6 bg-muted/30 border-t">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto h-12"
            aria-label="Cancel and return to dashboard"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg"
            aria-label={isEditing ? "Update variety" : "Plant new variety"}
            aria-busy={submitting}
          >
            {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isEditing ? "Update" : "Plant"} Variety
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
