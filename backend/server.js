const express = require("express")
const cors = require("cors")
const { config } = require("./config/config")
const varietiesRoutes = require("./routes/varieties")
const errorHandler = require("./middleware/errorHandler")

const app = express()
const PORT = config.port

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/varieties", varietiesRoutes)

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
