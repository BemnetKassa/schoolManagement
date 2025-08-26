import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

//load env variables from .env file
dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

//database connection
mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database connected successfully");
})
.catch((error) => {
    console.error("Database connection error:", error);
});


app.get("/", (req, res) => {
    res.send("the school management api is running..");
});

// Use routes
app.use("/api/auth", authRoutes);

//....Start server..
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});