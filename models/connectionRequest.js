import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    senderUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        indexedDB: true,
        required: true,
    },
    receiverUserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        indexedDB: true,
        required: true,
    },
    status: {
        type: String,
        enum: ["interested", "ignore", "accepted", "rejected"],
    },
}, { timestamps: true });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

export default ConnectionRequest;