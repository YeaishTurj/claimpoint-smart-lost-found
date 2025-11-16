const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===== Middleware to verify JWT and attach user =====
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    req.user = decoded; // { id, role }

    // Optional: fetch full user info
    req.userData = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ===== Middleware to authorize roles =====
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "You do not have permission to access this route" });
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
