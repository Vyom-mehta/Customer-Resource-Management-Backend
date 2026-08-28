const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Create Contact
router.post("/", async (req, res) => {
  try {
    const { name, dob, email, phone } = req.body;

    const newContact = new Contact({
      name,
      dob,
      email,
      phone,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: savedContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get All Contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Get Single Contact
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Update Contact
router.put("/:id", async (req, res) => {
  try {
    const { name, dob, email, phone } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        name,
        dob,
        email,
        phone,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// Delete All Contacts
router.delete("/all", async (req, res) => {
  try {
    const result = await Contact.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All contacts deleted successfully",
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

// Delete Contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
