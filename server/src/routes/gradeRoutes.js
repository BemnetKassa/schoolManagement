import express from "express";
import Grade from "../models/Grade.js";
import Course from "../models/course.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/grades
 * @desc    Teacher assigns grade to a student
 */
router.post("/", protect, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const { courseId, studentId, assignment, grade } = req.body;

    // check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // check if student is enrolled
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: "Student not enrolled in this course" });
    }

    const newGrade = new Grade({
      course: courseId,
      student: studentId,
      teacher: req.user._id,
      assignment,
      grade,
    });

    const savedGrade = await newGrade.save();
    res.status(201).json(savedGrade);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/grades/course/:courseId
 * @desc    Get all grades for a course (Teacher/Admin)
 */
router.get("/course/:courseId", protect, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const grades = await Grade.find({ course: req.params.courseId })
      .populate("student", "name email")
      .populate("teacher", "name email");
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/grades/my
 * @desc    Student views their grades
 */
router.get("/my", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user._id })
      .populate("course", "title description")
      .populate("teacher", "name email");
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
