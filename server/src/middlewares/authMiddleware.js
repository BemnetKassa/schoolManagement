import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===================== AUTH MIDDLEWARE =====================
export const protect = async (req, res, next) => {
  let token;

  // 1. Get token from headers: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach user to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// ===================== ROLE MIDDLEWARE =====================
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};
