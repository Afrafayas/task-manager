const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const app = express();  


//Middleware
app.use(cors());
app.use(express.json());
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);

// Health check
app.get("/", (req, res) => res.send("Task Manager API is running ✅"));

module.exports = app;




      
