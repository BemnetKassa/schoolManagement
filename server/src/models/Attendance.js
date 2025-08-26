import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      required: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
