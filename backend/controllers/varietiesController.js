const { v4: uuidv4 } = require("uuid")
const varietiesModel = require("../models/varietiesModel")

// Get all varieties
const getAllVarieties = (req, res) => {
  try {
    const varieties = varietiesModel.getAll()
    res.json(varieties)
  } catch (error) {
    res.status(500).json({ message: "Error fetching varieties", error: error.message })
  }
}

// Get a single variety by ID
const getVarietyById = (req, res) => {
  try {
    const variety = varietiesModel.getById(req.params.id)

    if (!variety) {
      return res.status(404).json({ message: "Variety not found" })
    }

    res.json(variety)
  } catch (error) {
    res.status(500).json({ message: "Error fetching variety", error: error.message })
  }
}

// Create a new variety
const createVariety = (req, res) => {
  try {
    const {
      cropName,
      varietyName,
      expectedYield,
      sowingDate,
      expectedHarvestDays,
      healthRating,
      estimatedHarvestDate,
    } = req.body

    const newVariety = {
      id: uuidv4(),
      cropName,
      varietyName,
      expectedYield,
      sowingDate,
      expectedHarvestDays,
      estimatedHarvestDate,
      healthRating,
    }

    const createdVariety = varietiesModel.create(newVariety)
    res.status(201).json(createdVariety)
  } catch (error) {
    res.status(500).json({ message: "Error creating variety", error: error.message })
  }
}

// Update an existing variety
const updateVariety = (req, res) => {
  try {
    const updatedVariety = varietiesModel.update(req.params.id, req.body)

    if (!updatedVariety) {
      return res.status(404).json({ message: "Variety not found" })
    }

    res.json(updatedVariety)
  } catch (error) {
    res.status(500).json({ message: "Error updating variety", error: error.message })
  }
}

// Delete a variety
const deleteVariety = (req, res) => {
  try {
    const success = varietiesModel.remove(req.params.id)

    if (!success) {
      return res.status(404).json({ message: "Variety not found" })
    }

    res.json({ message: "Variety deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting variety", error: error.message })
  }
}

module.exports = {
  getAllVarieties,
  getVarietyById,
  createVariety,
  updateVariety,
  deleteVariety,
}
