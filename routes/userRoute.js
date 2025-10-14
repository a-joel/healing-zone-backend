//Packages are imported to use in this module
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require("dotenv").config();

//External file import
const User = require("../models/userShema");

//Controllers
const authMiddleware = require("../controllers/authMiddleware");

//Routes are declared here
router.get("/", authMiddleware(["admin", "doctor", "patient"]), async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    return res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

//New user registration route
router.post("/auth/register", async (req, res) => {
  try {
    const { email, name, password,role = '', termsAndConditions } = req.body;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email invalid" });
    }

    if (!/^[a-zA-Z\s.'-]{2,50}$/.test(name)) {
      return res
        .status(400)
        .json({
          message:
            "Name must be 2-50 characters and contain only letters, spaces, dots, hyphens, or apostrophes",
        });
    }

    if (!/^[a-zA-Z0-9]{6,}/.test(password)) {
      return res.status(400).json({ message: "Password atleast 6" });
    }

    if (termsAndConditions !== true) {
      return res
        .status(400)
        .json({ message: "Please accept terms and conditons" });
    }

    const isEmail = await User.findOne({email});
    if (isEmail) {
      return res.status(400).json({ message: "Please Login." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      termsAndConditions,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      data: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: role,
        termsAndConditions: savedUser.termsAndConditions,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

//Logix endpoint
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Email invalid" });
  }

  if (!/^[a-zA-Z0-9]{6,}/.test(password)) {
    return res.status(400).json({ message: "Password atleast 6" });
  }

  try {
    const isUser = await User.findOne({email});
console.log(isUser.password);

    if (!isUser) {
      return res.status(400).json({ message: "Email doesn't registered." });
    }

    const decodePassword = await bcrypt.compare(password, isUser.password);

    if (!decodePassword) {
        return res.status(400).json({message: "Password wrong"});
    }

    const token = await jwt.sign({name: isUser.name, email: isUser.email, role: isUser.role}, process.env.JWT_SECRET_KEY, {expiresIn : '3h'} );

    console.log(token);
    
    return res.status(200).json({data: {
        name: isUser.name,
        email: isUser.email,
        role: isUser.role,
        token: token
    }});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

//Endpoint for updating a user credentials
router.put('/update/:id', authMiddleware(["admin", "patient"]), async (req, res) => {
  const updateCredentials = req.body;
  const {id} = req.params;

  try {

    const user = User.findById(id);
    
    const updateduser = await User.findByIdAndUpdate(id, updateCredentials);
    if (!updateduser) {
      return res.status(400).json({message: "User not found"});
    }
    console.log(updateCredentials);
    
    return res.status(200).json({message: "Credentials updated successfully", data: updateCredentials});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
    
  }
});

//Route for deleting the user
router.delete('/delete', async (req, res) => {
  const { email } = req.body;

  try {

    if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  
  // Find the user to get their data before deleting
  const userToDelete = await User.findOne({email});

    if (!userToDelete) {
      return res.status(404).json({ message: "No account to delete." });
    }

    // Now delete the user
    await User.deleteOne(userToDelete._id);

    console.log("Account deleted:", userToDelete);
    return res.status(200).json({ message: "Account deleted successfully", data: userToDelete });
  } catch (error) {
    console.error(error); // Use console.error for errors
    return res.status(500).json({ error: error.message });
  }
});

router.put('/change-password', authMiddleware(["patient"]), async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldPassword = bcrypt.compare(newPassword, user.password);

    if (oldPassword) {
      return res.status(400).json({ message: "New password must be different from the old password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in DB
    user.password = hashedPassword; // ← assuming your field is 'password'
    await user.save();

    // ✅ Success
    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error in /change-password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//Exporting the router module
module.exports = router;
