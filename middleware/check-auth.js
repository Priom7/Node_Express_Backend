const HttpError = require("../models/http-error");
const jsonWebToken = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }
    // Authorization : "Bearer" TOKEN
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication Failed!!");
    }
    const decodedToken = jsonWebToken.verify(
      token,
      process.env.JSON_WEB_TOKEN_KEY
    );
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed.", 403);
    return next(error);
  }
};
