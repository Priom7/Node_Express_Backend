const express = require("express");
const body_Parser = require("body-parser");
const places_Routes = require("./routes/places-routes");
const users_Routes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(body_Parser.json());
app.use("/api/places", places_Routes);
app.use("/api/users", users_Routes);

app.use((req, res, next) => {
  const error = new HttpError("Cloud not find the route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

app.listen(5000);
