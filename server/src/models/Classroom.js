import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Example: "Grade 10A"
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Must be Student role
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const Classroom = mongoose.model("Classroom", classroomSchema);
export default Classroom;
