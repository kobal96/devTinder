import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import  User from "../models/users.js";

dotenv.config();


const UserAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: "User not found" });
    }else{
        // console.log("Authenticated user ID:", req.user);
        req.user = await User.findById(decoded.user_id).select("-password") ;
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
export default UserAuth;    
