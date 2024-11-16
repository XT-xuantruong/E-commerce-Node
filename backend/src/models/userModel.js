const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          );
        },
        message:
          "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return /^\d{10}$/.test(value);
        },
        message: "Invalid phone number format",
      },
    },
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
