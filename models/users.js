import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email format shiv");
                }
            },
        },
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    age: {
        type: Number,
        default: 18,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other",
    },
    location: {
        type: String,
        default: "",
    },
    skills: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

userSchema.methods.jwtToken = async function () {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not set in environment variables");
    }
    return jwt.sign({ user_id: this._id }, secret, { expiresIn: "1h" });
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("Users", userSchema);

export default User;    