const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    phone: { type: String },

    role: {
      type: String,
      enum: ["superadmin", "staff", "user"],
      default: "user",
    },

    // Staff-specific info
    staffInfo: {
      department: String,
      employeeId: { type: String, unique: true, sparse: true },
      active: { type: Boolean, default: true },
    },

    // General user info
    userInfo: {
      address: String,
      nationalId: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
