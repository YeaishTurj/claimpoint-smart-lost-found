import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import itemRoutes from "./src/routes/item.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import { roleAuthorization } from "./src/middlewares/roleAuth.middleware.js";
import { authenticateToken } from "./src/middlewares/auth.middleware.js";
import { optionalAuthenticateToken } from "./src/middlewares/optionalAuth.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use(
  "/api/admin",
  authenticateToken,
  roleAuthorization("ADMIN"),
  adminRoutes
);

app.use(
  "/api/staff",
  authenticateToken,
  roleAuthorization("STAFF"),
  staffRoutes
);

app.use("/api/user", authenticateToken, roleAuthorization("USER"), userRoutes);

app.use("/api/items", optionalAuthenticateToken, itemRoutes);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("ClaimPoint Smart Lost & Found Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
