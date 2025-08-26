import express from "express"
import dotenv from "dotenv";
import mongoos from "mongoose";
import cors from "cors";
import e from "express";
import mongoose from "mongoose";

//load env variables from .env file
dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//database connection
mongoose
.connect(process.env.MONGO_URL, {
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

// In the future, we will import routes like:
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/courses", courseRoutes);

//....Start server..
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});