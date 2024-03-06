const express = require("express");

// controller functions
const {
  loginUser,
  signupUser,
  resetUser,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// reset route
router.put("/reset", resetUser);

module.exports = router;
