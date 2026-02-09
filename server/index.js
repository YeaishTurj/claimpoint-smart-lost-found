import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import itemRoutes from "./src/routes/item.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import { roleAuthorization } from "./src/middlewares/roleAuth.middleware.js";
import { authenticateToken } from "./src/middlewares/auth.middleware.js";
import { optionalAuthenticateToken } from "./src/middlewares/optionalAuth.middleware.js";
import { initCronJobs } from "./src/utils/cron.js";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use(
  "/api/admin",
  authenticateToken,
  roleAuthorization("ADMIN"),
  adminRoutes,
);

app.use(
  "/api/staff",
  authenticateToken,
  roleAuthorization("STAFF"),
  staffRoutes,
);

app.use("/api/user", authenticateToken, roleAuthorization("USER"), userRoutes);

app.use("/api/items", optionalAuthenticateToken, itemRoutes);

app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("ClaimPoint Smart Lost & Found Backend is running.");
});

initCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
