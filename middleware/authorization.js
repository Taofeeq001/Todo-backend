const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract token from Bearer scheme
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password -__v"); // Exclude password and __v field

    // console.log("Decoded user:", decoded);
    // console.log("User from database:", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
module.exports = authorize;
