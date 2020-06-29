// Importing modules

const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");
// Getting Router from Express

const router = express.Router();

//order of route matters

// Fetching place by Place Id

router.get("/:pid", placesControllers.getPlaceById);

// Fetching places by user/creator Id

router.get("/user/:uid", placesControllers.getPlacesByUserId);

// Validating inputs and creating place

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

// Validating inputs and updating place

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlaceById
);

// Deleting Place by place id

router.delete("/:pid", placesControllers.deletePlaceById);

// Exporting module

module.exports = router;
