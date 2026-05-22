import express from "express";
const profilerouter = express.Router();
import UserAuth from "../middleware/auth.js";
import bcrypt from "bcryptjs";
// import user from "../models/users.js";
import User from "../models/users.js";
profilerouter.get("/api/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
profilerouter.patch("/api/profile/edit", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    const AllowedFields = [
      "firstName",
      "lastName",
      "email",
      "profilePicture",
      "bio",
      "age",
      "gender",
      "location",
      "skills",
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      AllowedFields.includes(update),
    );
    if (!isValidOperation) {
      return res
        .status(400)
        .json({ message: "Invalid field added for updates!" });
    }
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile updated successfully", user });
    // res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
profilerouter.patch(
  "/api/profile/update-password",
  UserAuth,
  async (req, res) => {
    try {
      const authUser = req.user;
      const { currentPassword, newPassword, retypePassword } = req.body;
      if (!currentPassword || !newPassword || !retypePassword) {
        return res
          .status(400)
          .json({ message: "All password fields are required" });
      }
      if (newPassword !== retypePassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }
      const user = await User.findById(authUser._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      console.log("New hashed password:", user.password);
      await user.save();
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);
export default profilerouter;
