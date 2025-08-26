import express from "express";
import Course from "../models/course.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/courses
 * @desc    Create a course (Admin/Teacher only)
 */
router.post("/", protect, authorizeRoles("admin", "teacher"), async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = new Course({
      title,
      description,
      teacher: req.user._id, // logged-in teacher/admin
    });

    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/courses
 * @desc    Get all courses (Public - everyone can see)
 */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email role")
      .populate("students", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/courses/:id/enroll
 * @desc    Enroll a student in a course (Student only)
 */
router.post("/:id/enroll", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(req.user._id);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course (Admin/Teacher who created it)
 */
router.delete("/:id", protect, authorizeRoles("admin", "teacher"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // only admin or teacher who created it can delete
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
