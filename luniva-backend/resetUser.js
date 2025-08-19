const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("Connected to MongoDB");

  // Delete existing user
  await User.deleteOne({ email: "newtest@example.com" });
  console.log("Old user deleted");

  // Create new user with hashed password
  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash("password", 10);
  const newUser = new User({
    fullName: "Test User",
    email: "newtest@example.com",
    password: hashedPassword
  });
  await newUser.save();
  console.log("New user created");

  mongoose.disconnect();
})
.catch(err => console.error(err));
