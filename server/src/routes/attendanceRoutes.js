import express from "express";
import Attendance from "../models/Attendance.js";
import Course from "../models/course.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/attendance
 * @desc    Mark attendance (Teacher/Admin only)
 */
router.post("/", protect, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const { courseId, studentId, status, date } = req.body;

    // check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // check if student is enrolled
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: "Student not enrolled in this course" });
    }

    const newAttendance = new Attendance({
      course: courseId,
      student: studentId,
      teacher: req.user._id,
      status,
      date: date || new Date(),
    });

    const savedAttendance = await newAttendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/attendance/course/:courseId
 * @desc    View attendance records for a course (Teacher/Admin only)
 */
router.get("/course/:courseId", protect, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const attendance = await Attendance.find({ course: req.params.courseId })
      .populate("student", "name email")
      .populate("teacher", "name email");
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/attendance/my
 * @desc    Student views their own attendance
 */
router.get("/my", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user._id })
      .populate("course", "title description")
      .populate("teacher", "name email");
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
