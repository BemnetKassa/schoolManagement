import express from "express";
import Notice from "../models/notice.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/notices
 * @desc    Create a notice (Admin/Teacher only)
 */
router.post("/", protect, authorizeRoles("admin", "teacher"), async (req, res) => {
  try {
    const { title, message, targetAudience } = req.body;

    const newNotice = new Notice({
      title,
      message,
      targetAudience,
      createdBy: req.user._id,
    });

    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/notices
 * @desc    Get all notices (Everyone can view based on role)
 */
router.get("/", protect, async (req, res) => {
  try {
    let filter = { targetAudience: "all" };

    if (req.user.role === "student") {
      filter = { $or: [{ targetAudience: "all" }, { targetAudience: "students" }] };
    } else if (req.user.role === "teacher") {
      filter = { $or: [{ targetAudience: "all" }, { targetAudience: "teachers" }] };
    }

    const notices = await Notice.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/notices/:id
 * @desc    Delete a notice (Admin/Teacher who created it OR Admins only)
 */
router.delete("/:id", protect, authorizeRoles("admin", "teacher"), async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) return res.status(404).json({ message: "Notice not found" });

    if (req.user.role !== "admin" && notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this notice" });
    }

    await notice.deleteOne();
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
