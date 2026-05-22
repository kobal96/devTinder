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

            if(connections.length === 0){
                return res.status(404).json({ message: "No connections found" });
            }

            console.log("Connections found:", connections[0].senderUserId._id);
            // return false÷;
            var connectedUser;
            if(connections[0].senderUserId._id.toString() === req.user._id.toString()){

                connectedUser = connections[0].receiverUserId;
            }else{
                // throw new Error("Unexpected connection data structure÷");
                connectedUser = connections[0].senderUserId;
            }

        res.json({ connectedUser });  



    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });



export default userrouter;
