import express from "express";
const authrouter = express.Router();
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


authrouter.post("/api/users", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    profilePicture,
    bio,
    age,
    gender,
    location,
    skills,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed password:", hashedPassword);
    // return false;
    User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture,
      bio,
      age,
      gender,
      location,
      skills,
    })
      .then((user) => {
        res.status(201).json({ message: "User created", user });
      })
      .catch((err) => {
        res.status(400).json({ message: "Error creating user", error: err });
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Here you would typically save the user to the database

authrouter.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const token =   await user.jwtToken();
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.json({ message: "Login successful"});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
);

authrouter.post("/api/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logout successful" });
});

export default authrouter;
