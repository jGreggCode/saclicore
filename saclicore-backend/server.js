import express from "express";
import cors from "cors";
import "dotenv/config";

// Database Connection
import conn from "./config/dbconnection.js";
// Routes Imports
import userRouter from "./routes/userRoutes.js";

const app = express();

// Server Configuration
const port = process.env.PORT || 3000;
conn(); // Connect to the database

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Endpoints
app.use("/api/user", userRouter);

// Server Start
app.listen(port, () => {
  console.log("Server started on PORT: " + port);
});
