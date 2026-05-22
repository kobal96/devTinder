import express from "express";
const userrouter = express.Router();
import User from "../models/users.js";
import ConnectionRequest from "../models/connectionRequest.js";
import UserAuth from "../middleware/auth.js";
import bcrypt from "bcryptjs";
userrouter.get("/api/users/connectionRequested", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const requstedConnections = await ConnectionRequest.find({
      receiverUserId: userId,
      status: "interested",
    }).populate("senderUserId", "firstName lastName email profilePicture");
    res.json({ requestedConnections: requstedConnections });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
userrouter.get("/api/users/connected", UserAuth, async (req, res) => {
  try {
    const condition = {
      $or: [
        { senderUserId: req.user._id, status: "accepted" },
        { receiverUserId: req.user._id, status: "accepted" },
      ],
    };
    const connections = await ConnectionRequest.find(condition)
      .populate("senderUserId", "firstName lastName  profilePicture")
      .populate("receiverUserId", "firstName lastName  profilePicture");
    if (connections.length === 0) {
      return res.status(404).json({ message: "No connections found" });
    }
    console.log("Connections found:", connections[0].senderUserId._id);
    // return false÷;
    var connectedUser;
    if (
      connections[0].senderUserId._id.toString() === req.user._id.toString()
    ) {
      connectedUser = connections[0].receiverUserId;
    } else {
      // throw new Error("Unexpected connection data structure÷");
      connectedUser = connections[0].senderUserId;
    }
    res.json({ connectedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
userrouter.get("/api/users/feed", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    // add pagination and sorting by recently joined users÷
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
    const page = parseInt(req.query.page) || 1; // Default skip to 1 if not provided
    const skip = (page - 1) * limit; // Calculate the number of documents to skip based on the page number
    const connections = await ConnectionRequest.find({
      $or: [{ senderUserId: userId }, { receiverUserId: userId }],
    });
    if (connections.length === 0) {
      return res.status(404).json({ message: "No connections found" });
    }
    const hideUserFromFeed = new Set();
    connections.forEach((connection) => {
      hideUserFromFeed.add(connection.senderUserId.toString());
      hideUserFromFeed.add(connection.receiverUserId.toString());
      // console.log("Users to hide from feed:", hideUserFromFeed);
    });
    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select("firstName lastName email profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ feedUsers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
export default userrouter;
