const User = require("../models/User");
const express = require("express");
const router = express.Router();
const { generateToken } = require("../jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    console.log("data : ", data);

    const { email, mobileNumber } = data;

    const existingUser = await User.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const user = new User(data);

    const response = await user.save();
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;

    const user = await User.findOne({ email: email });

    console.log("user found by  Email : ", user);

    const isMatch = user.comparePassword(password);

    if (!user || !isMatch) {
      console.log("email or password is not correct");
      return res
        .status(404)
        .json({ error: "email or password is not correct" });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = generateToken(payload);

    res.status(200).json({ user: user, token: token });
  } catch (error) {
    console.log("error in login", error);
    res.status(404).json({ error: "error in login" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error fetching user:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstname,
      lastname,
      mobileNumber,
      role,
      location,
      bio,
      social,
      address,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        mobileNumber,
        role,
        location,
        bio,
        social,
        address,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error updating profile:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
