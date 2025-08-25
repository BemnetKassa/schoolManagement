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


