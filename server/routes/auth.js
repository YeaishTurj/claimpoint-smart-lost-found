const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ===== SIGNUP =====
router.post("/signup", 
  async (req, res) => {
  try {
    const { name, email, password, role, staffInfo, userInfo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      staffInfo,
      userInfo,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== LOGIN =====
router.post("/login", 
  async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Superadmin-only route example
router.post(
  "/create-staff",
  authenticateToken,
  authorizeRoles("superadmin"),
  async (req, res) => {
    try {
      const { name, email } = req.body; // no password from input

      if (!name || !email) {
        return res.status(400).json({ msg: "Name and email are required" });
      }

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      // Default password
      const defaultPassword = "123456";

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      const staff = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "staff",
      });

      res.status(201).json({
        msg: "Staff account created successfully",
        staff: {
          id: staff._id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
        },
        defaultPassword: defaultPassword, // optional: return default password
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Staff-only route example
router.post("/add-found-item", authenticateToken, authorizeRoles("staff"), async (req, res) => {
  // Staff can add items
});

// Route accessible by both staff & superadmin
router.get("/all-users", authenticateToken, authorizeRoles("staff", "superadmin"), async (req, res) => {
  // Fetch users
});


module.exports = router;
