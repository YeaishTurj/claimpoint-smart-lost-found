const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const seedSuperadmin = async () => {
  try {
    const existing = await User.findOne({ role: "superadmin" });
    if (existing) {
      console.log("Superadmin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("superadmin123", 10); // Default password

    const superadmin = new User({
      name: "Yeaish Turj",
      email: "yjturj12104@gmail.com",
      password: hashedPassword,
      role: "superadmin",
    });

    await superadmin.save();
    console.log("Superadmin created successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSuperadmin();
