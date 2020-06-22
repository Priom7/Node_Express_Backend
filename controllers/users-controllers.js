const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const uuid = require("uuid");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Sharif Alam",
    email: "test1@gmail.com",
    password: "test1",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signUpUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("Could not create user, email id already exist", 422);
  }
  const createdUser = {
    id: uuid.v4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify the user, credentials seem to be wrong",
      401
    );
  }
  res.json({ message: "Logged in!!" });
};

exports.getUsers = getUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;
