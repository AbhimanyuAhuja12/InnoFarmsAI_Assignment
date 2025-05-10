const express = require("express")
const router = express.Router()
const varietiesController = require("../controllers/varietiesController")

// GET all varieties
router.get("/", varietiesController.getAllVarieties)

// GET a single variety
router.get("/:id", varietiesController.getVarietyById)

// POST a new variety
router.post("/", varietiesController.createVariety)

// PATCH an existing variety
router.patch("/:id", varietiesController.updateVariety)

// DELETE a variety
router.delete("/:id", varietiesController.deleteVariety)

module.exports = router
