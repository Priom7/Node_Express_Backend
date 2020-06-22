const express = require("express");
const { check } = require("express-validator");
const users_controllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", users_controllers.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  users_controllers.signUpUser
);
router.post("/login", users_controllers.loginUser);

module.exports = router;
