const axios = require("axios");
const HttpError = require("../models/http-error");
const API_KEY = "";

async function getCoordinatesForAddress(address) {
  //dummy data
  return {
    lat: 23.7266207,
    lng: 90.4215769,
  };

  //don't have any valid api key. ToDo : Enable billing method

  //   const response = await axios.get(
  //     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //       address
  //     )}&key=${API_KEY}`
  //   );

  //   const data = response.data;
  //   console.log(data);
  //   if (!data || data.status === "ZERO_RESULTS") {
  //     const error = new HttpError(
  //       "Could not find location for the specified address.",
  //       422
  //     );
  //     throw error;
  //   }
  //   const coordinates = data.results[0].geometry.location;
  //   return coordinates;
}

module.exports = getCoordinatesForAddress;
