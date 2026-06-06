const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 1 * 60 * 60 * 1000,
};

function ensureDbReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: "Database unavailable. Check MONGO_URL on the server.",
    });
    return false;
  }

  if (!process.env.JWT_SECRET) {
    res.status(503).json({
      message: "Server misconfigured. JWT_SECRET is missing.",
    });
    return false;
  }

  return true;
}

async function registerController(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName?.firstName || !fullName?.lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!ensureDbReady(res)) return;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await userModel.create({
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      },
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        firstName: user.fullName.firstName,
        lastName: user.fullName.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (!ensureDbReady(res)) return;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.fullName.firstName,
        lastName: user.fullName.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
}

async function meController(req, res) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel
      .findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        firstName: user.fullName.firstName,
        lastName: user.fullName.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function logoutController(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  meController,
};