import express from "express";
import 'dotenv/config';
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.js";
import userrouter from "./routes/user.js";
import profilerouter from "./routes/profile.js";
import requestconnect from "./routes/request.js";

// dotenv is loaded above via `import 'dotenv/config'` so env vars are available to imported modules
const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/", authrouter);
app.use("/", userrouter);
app.use("/", profilerouter);
app.use("/",requestconnect)
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });


