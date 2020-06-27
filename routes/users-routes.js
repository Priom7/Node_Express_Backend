// Importing modules

const express = require("express");
const { check } = require("express-validator");
const users_controllers = require("../controllers/users-controllers");

// Getting Router from Express

const router = express.Router();

// Fetching all users

router.get("/", users_controllers.getUsers);

// validating inputs and Signing Up Users

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  users_controllers.signUpUser
);

// Logging in Users

router.post("/login", users_controllers.loginUser);

// Exporting module

module.exports = router;
