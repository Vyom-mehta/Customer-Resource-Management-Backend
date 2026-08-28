const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },

    lastname: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "User",
    },

    location: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    social: {
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
    },

    address: {
      country: {
        type: String,
        default: "",
      },
      cityState: {
        type: String,
        default: "",
      },
      postalCode: {
        type: String,
        default: "",
      },
      taxId: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    user.password = hashPassword;
    console.log(" hashing  successfull");
  } catch (error) {
    console.log("error in createing hash password : ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    console.log(enteredPassword, this.password);

    const isMatch = await bcrypt.compare(enteredPassword, this.password);

    return isMatch;
  } catch (error) {
    console.log("checked in compare password function but error ");
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);
