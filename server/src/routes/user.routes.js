import express from "express";
import User from "../models/User.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 */
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user role (Admin only)
 */
router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role || user.role;
    await user.save();

    res.json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 */
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
