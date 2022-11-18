const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ISI CLOUD NAME",
  api_key: "ISI API KEY",
  api_secret: "ISI API SECRET",
  secure: true,
});

module.exports = cloudinary;
