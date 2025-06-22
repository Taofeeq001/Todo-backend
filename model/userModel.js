const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      // trim: true
      lowercase: true, // Store email in lowercase
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Exclude password from queries by default
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
