// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs"; // Import fs to work with file system
import { connectDB } from "./config/dbConfig.js";
import usersRouter from "./routes/users.js";
import contactRouter from "./routes/contact.js";
import trainingCarouselRouter from "./routes/trainingCarousel.js";
import ganttRouter from "./routes/gantt.js"; // Import the new Gantt routes

const app = express();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware for JSON parsing and enabling CORS
app.use(express.json());
app.use(cors());

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(uploadDir));

// Mount routes
app.use("/users", usersRouter);
app.use("/api/contact", contactRouter);
app.use("/api/training-carousel", trainingCarouselRouter);
app.use("/api/gantt", ganttRouter); // Mount the new Gantt routes

const PORT = process.env.PORT || 5001;

async function startServer() {
  await connectDB(); // Ensure DB connection is established first
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();