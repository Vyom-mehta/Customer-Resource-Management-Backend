const express = require("express");
const router = express.Router();
const Account = require("../models/Account");

// Create Account
router.post("/", async (req, res) => {
  try {
    const { owner, name, number, website, type, revenue } = req.body;

    const newAccount = new Account({
      owner,
      name,
      number,
      website,
      type,
      revenue,
    });

    const savedAccount = await newAccount.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: savedAccount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get All Accounts
router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find();

    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get Single Account
router.get("/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      account,
    });
  } catch (error) {
    console.error("Error fetching account:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Update Account
router.put("/:id", async (req, res) => {
  try {
    const { owner, name, number, website, type, revenue } = req.body;

    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      {
        owner,
        name,
        number,
        website,
        type,
        revenue,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    console.error("Error updating account:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Delete All Accounts
router.delete("/all", async (req, res) => {
  try {
    const result = await Account.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All accounts deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Delete Single Account
router.delete("/:id", async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
