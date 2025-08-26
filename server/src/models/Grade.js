import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignment: {
      type: String,
      required: true, // e.g. "Midterm Exam", "Project 1"
    },
    grade: {
      type: String,
      required: true, // e.g. "A", "B+", "75%"
