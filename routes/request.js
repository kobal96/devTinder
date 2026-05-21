import express from "express";
const requestconnect = express.Router();
import authUser from "../middleware/auth.js";
import User from "../models/users.js";
import ConnectionRequest from "../models/connectionRequest.js";



requestconnect.post(
  "/api/request/send/:status/:userId",
  authUser,
  async (req, res) => {
    try {
      // const { status, userId } = req.params;
      // Your logic here to handle the connection request based on the status and userId
      const validStatuses = ["interested", "ignore", "reject", "accepted"];
      if (!validStatuses.includes(req.params.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const senderUserId = req.user._id; // Assuming you have user authentication middleware that sets req.user
      const receiverUserId = req.params.userId;
      const status = req.params.status;
      // Implement your logic to save the connection request in the database
      // For example, you might have a ConnectionRequest model to handle this
      // await ConnectionRequest.create({ sender: senderUserId, receiver: receiverUserId, status });
      // find the receiverUserId and senderUserId in the database and update the connection status based on the status value÷
      const receiverUser = await User.findById(receiverUserId);
      if (!receiverUser) {
        return res.status(404).json({ message: "Receiver user not found" });
      }
      const senderUser = await User.findById(senderUserId);
      if (!senderUser) {
        return res.status(404).json({ message: "Sender user not found" });
      }
      // Update the connection status based on the status value
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { senderUserId, receiverUserId },
          { senderUserId: receiverUserId, receiverUserId: senderUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }
      const connectionRequest = new ConnectionRequest({
        senderUserId,
        receiverUserId,
        status,
      });
      const data = await connectionRequest.save();
      // const emailRes = await sendEmail.run(
      //   "A new friend request from " + req.user.firstName,
      //   req.user.firstName + " is " + status + " in " + toUser.firstName
      // );
      // console.log(emailRes);
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + senderUser.firstName,
        data,
      });
      res.json({ message: "Connection request processed successfully" });
    
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);
export default requestconnect;
