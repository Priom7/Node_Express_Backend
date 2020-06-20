const express = require("express");
const users_controllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", users_controllers.getUsers);
router.post("/signup", users_controllers.signUpUser);
router.post("/login", users_controllers.loginUser);

module.exports = router;
