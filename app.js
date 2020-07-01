// Importing modules
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

// Getting express() from express

const app = express();

// Parsing JSON Data from

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// For CORS fix in browser error

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Using Places API routs

app.use("/api/places", placesRoutes);

// Using Users API routes

app.use("/api/users", usersRoutes);

// Using Custom HttpError Model

app.use((req, res, next) => {
  const error = new HttpError("Cloud not find the route.", 404);
  throw error;
});

// Using Special Error handling middleware function (with 4 parameters).
// Will only executed when requests that has error attached with it

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(error);
    });
  }
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

// Connecting To MongoDB database and starting backend server

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-soxqi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((error) => {
    console.log(error);
  });
