// Importing modules
const fs = require("fs");
const { validationResult, check } = require("express-validator");
const getCoordinatesFromAddress = require("../util/location");
const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

// Fetching Place by Id

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// Fetching places by User/ creator Id

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  let users;
  try {
    places = await Place.find({ creator: userId });
    users = await User.findOne({ _id: userId }, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later...",
      500
    );
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a places for the provided user id.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
    users: users,
  });
};

// Creating Place

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesFromAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Could not find user for the provided id, please try again...",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find the user for provided id", 404);
    return next(error);
  }

  try {
    const createPlaceSession = await mongoose.startSession();
    createPlaceSession.startTransaction();
    await createdPlace.save({ session: createPlaceSession });
    user.places.push(createdPlace);
    await user.save({ session: createPlaceSession });
    await createPlaceSession.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again...",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// Updating Place by Place Id

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place...",
      500
    );
    return next(error);
  }
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit the place...",
      401
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place....",
      500
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// Deleting Place by Place Id

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the place...",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id...", 404);
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete the place...",
      401
    );
    return next(error);
  }
  const imagePath = place.image;

  try {
    const deleteSession = await mongoose.startSession();
    deleteSession.startTransaction();
    await place.remove({ session: deleteSession });
    place.creator.places.pull(place);
    await place.creator.save({ session: deleteSession });
    await deleteSession.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the place...",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Deleted Place" });
};

// Exporting

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
