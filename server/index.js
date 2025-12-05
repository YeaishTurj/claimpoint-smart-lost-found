import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("ClaimPoint Smart Lost & Found Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
