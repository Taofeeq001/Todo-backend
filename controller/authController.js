const mongoose = require("mongoose");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { welcomeEmail, loginEmail, sendEmail } = require("../utils/email");

const signUp = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      return res.status(400).json({ message: "User already exists" });
    }

    //hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [
        {
          fullName,
          email,
          password: hashPassword, // Store the hashed password
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Send welcome email (don't await to avoid delaying response)
    sendEmail(email, welcomeEmail(fullName));

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser[0]._id,
        fullName: newUser[0].fullName,
        email: newUser[0].email,
      },
    });
  } catch (error) {
    // Only abort if transaction hasn't been committed
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    // await session.abortTransaction();
    console.error("Error starting session:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    // Always end the session
    session.endSession();
  }
};

const login = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Explicitly select password field
  const user = await User.findOne({ email }).select("+password");
  try {
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Send login notification email (don't await)
    sendEmail(user.email, loginEmail(user.fullName));

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
    });
  } catch (error) {
    return res.json({
      message: "An error occured, please try again",
    });
  }
};

module.exports = {
  signUp,
  login,
};
