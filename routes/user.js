import express from "express";
const userrouter = express.Router();
import User from "../models/users.js";
import UserAuth from "../middleware/auth.js";
import bcrypt from "bcryptjs";

userrouter.get("/api/users", UserAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}); 



export default userrouter;
