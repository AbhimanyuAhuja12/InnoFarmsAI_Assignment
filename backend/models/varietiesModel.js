const { addDays, format } = require("date-fns")

// In-memory database
const varieties = [
  {
    id: "1",
    cropName: "Tomato",
    varietyName: "Cherry",
    expectedYield: 25.5,
    sowingDate: "2025-03-15",
    expectedHarvestDays: 70,
    estimatedHarvestDate: "2025-05-24",
    healthRating: 4,
  },
  {
    id: "2",
    cropName: "Lettuce",
    varietyName: "Butterhead",
    expectedYield: 12.3,
    sowingDate: "2025-04-01",
    expectedHarvestDays: 45,
    estimatedHarvestDate: "2025-05-16",
    healthRating: 5,
  },
  {
    id: "3",
    cropName: "Cucumber",
    varietyName: "Marketmore",
    expectedYield: 30.0,
    sowingDate: "2025-04-10",
    expectedHarvestDays: 60,
    estimatedHarvestDate: "2025-06-09",
    healthRating: 3,
  },
  {
    id: "4",
    cropName: "Spinach",
    varietyName: "Bloomsdale",
    expectedYield: 8.7,
    sowingDate: "2025-03-20",
    expectedHarvestDays: 40,
    estimatedHarvestDate: "2025-04-29",
    healthRating: 4,
  },
  {
    id: "5",
    cropName: "Basil",
    varietyName: "Sweet Basil",
    expectedYield: 5.2,
    sowingDate: "2025-04-05",
    expectedHarvestDays: 30,
    estimatedHarvestDate: "2025-05-05",
    healthRating: 5,
  },
  {
    id: "6",
    cropName: "Capsicum",
    varietyName: "California Wonder",
    expectedYield: 18.5,
    sowingDate: "2025-03-25",
    expectedHarvestDays: 80,
    estimatedHarvestDate: "2025-06-13",
    healthRating: 3,
  },
  {
    id: "7",
    cropName: "Carrot",
    varietyName: "Nantes",
    expectedYield: 15.0,
    sowingDate: "2025-04-15",
    expectedHarvestDays: 70,
    estimatedHarvestDate: "2025-06-24",
    healthRating: 4,
  },
  {
    id: "8",
    cropName: "Onion",
    varietyName: "Red Creole",
    expectedYield: 22.3,
    sowingDate: "2025-03-10",
    expectedHarvestDays: 90,
    estimatedHarvestDate: "2025-06-08",
    healthRating: 2,
  },
  {
    id: "9",
    cropName: "Potato",
    varietyName: "Yukon Gold",
    expectedYield: 40.0,
    sowingDate: "2025-04-20",
    expectedHarvestDays: 100,
    estimatedHarvestDate: "2025-07-29",
    healthRating: 5,
  },
  {
    id: "10",
    cropName: "Broccoli",
    varietyName: "Calabrese",
    expectedYield: 14.8,
    sowingDate: "2025-04-05",
    expectedHarvestDays: 85,
    estimatedHarvestDate: "2025-06-29",
    healthRating: 3,
  },
  {
    id: "11",
    cropName: "Kale",
    varietyName: "Curly Kale",
    expectedYield: 10.5,
    sowingDate: "2025-03-30",
    expectedHarvestDays: 50,
    estimatedHarvestDate: "2025-05-19",
    healthRating: 4,
  },
  {
    id: "12",
    cropName: "Beans",
    varietyName: "Kentucky Wonder",
    expectedYield: 20.0,
    sowingDate: "2025-04-25",
    expectedHarvestDays: 55,
    estimatedHarvestDate: "2025-06-19",
    healthRating: 4,
  },
]

// Get all varieties
const getAll = () => {
  return varieties
}

// Get a variety by ID
const getById = (id) => {
  return varieties.find((v) => v.id === id)
}

// Create a new variety
const create = (variety) => {
  varieties.push(variety)
  return variety
}

// Update a variety
const update = (id, updates) => {
  const index = varieties.findIndex((v) => v.id === id)

  if (index === -1) {
    return null
  }

  const updatedVariety = {
    ...varieties[index],
    ...updates,
  }

  varieties[index] = updatedVariety
  return updatedVariety
}

// Remove a variety
const remove = (id) => {
  const index = varieties.findIndex((v) => v.id === id)

  if (index === -1) {
    return false
  }

  varieties.splice(index, 1)
  return true
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
}
