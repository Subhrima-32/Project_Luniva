const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register new user
exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("Register attempt:", email);

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ fullName, email, passwordHash: hashedPassword });
    await user.save();

    console.log("User registered successfully:", email);
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register error full stack:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("No user found with this email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password incorrect for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Login successful for user:", email);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error full stack:", err);
    res.status(500).json({ message: "Server error" });
  }
};
