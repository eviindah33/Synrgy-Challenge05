const express = require("express");

// Upload to Local
// const upload = require("./helpers/fileUpload"); //upload lewat database internal

// Upload to Cloud
const upload = require("./helpers/fileUploadCloudinary"); //upload lewat database online

const cloudinary = require("./configs/cloudinary");

const app = express();

app.use(express.json());

const { cars } = require("./models");

const getCarsHandler = (req, res) => {
  cars.findAll().then((car) => {
    res.json({
      status: "OK",
      message: "Success retrieving data",
      data: cars.rows,
    });
  });
};

const createCarHandler = (req, res) => {
  const { name, rent_price, size } = req.body;
  if (!name || !rent_price || !size || !req.file) {
    res.status(400).send({
      status: "BAD_REQUEST",
      message: "Name, Rent Price, Size, and Image should not be empty",
      data: null,
    });
    return;
  }

  const fileToUpload = req.file;

  const fileBase64 = fileToUpload.buffer.toString("base64");
  const file = `data:${fileToUpload.mimetype};base64,${fileBase64}`;

  cloudinary.uploader.upload(file, (err, result) => {
    console.log(result);
    if (err) {
      res.status(400).send(`Failed to upload file to cloudinary: ${err.message}`);

      return;
    }

    cars
      .create({
        name: req.body.name,
        rent_price: req.body.rent_price,
        size: req.body.size,
        image: result.url,
      })
      .then((car) => {
        res.json({
          status: "OK",
          message: "Successfully insert data into database",
          data: car,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "INTERNAL_SERVER_ERROR",
          message: err.message,
          data: null,
        });
      });
  });
  return;
};

const getCarDetailHandler = (req, res) => {
  cars.findOne({ where: { id: req.params.id } }).then((car) => {
    if (car !== null) {
      res.json({
        status: "OK",
        message: "Success retrieving data",
        data: car,
      });
    } else {
      res.status(404).json({
        status: "NOT_FOUND",
        message: "Car Not Found",
        data: null,
      });
    }
  });
  return;
};

const updateCarHandler = (req, res) => {
  const { name, rent_price, size } = req.body;
  if (!name || !rent_price || !size || !req.file) {
    res.status(400).send({
      status: "BAD_REQUEST",
      message: "Name, Rent Price, Size, and Image should not be empty",
      data: null,
    });

    return;
  }

  const fileToUpload = req.file;

  const fileBase64 = fileToUpload.buffer.toString("base64");
  const file = `data:${fileToUpload.mimetype};base64,${fileBase64}`;

  cloudinary.uploader.upload(file, (err, result) => {
    console.log(result);
    if (err) {
      res.status(400).send(`Failed to upload file to cloudinary: ${err.message}`);

      return;
    }

    cars
      .update(
        {
          name: req.body.name,
          rent_price: req.body.rent_price,
          size: req.body.size,
          image: result.url,
        },
        {
          where: { id: req.params.id },
        }
      )
      .then((car) => {
        res.json({
          status: "OK",
          message: "Success updating data",
          data: car,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "INTERNAL_SERVER_ERROR",
          message: err.message,
          data: null,
        });
      });
  });
  return;
};

const deleteCarByIDHandler = (req, res) => {
  cars
    .destroy({
      where: { id: req.params.id },
    })
    .then((car) => {
      console.log(car);
      if (car !== 0) {
        res.json({
          status: "OK",
          message: "Success deleting data",
          data: car,
        });
      } else {
        res.status(404).json({
          status: "NOT_FOUND",
          message: "Data not found",
          data: null,
        });
      }
    });
  return;
};

app.get("/api/cars", getCarsHandler);
app.post("/api/cars", upload.single("picture"), createCarHandler);
app.get("/api/cars/:id", getCarDetailHandler);
app.put("/api/cars/:id", upload.single("picture"), updateCarHandler);
app.delete("/api/cars/:id", deleteCarByIDHandler);

app.listen(1000, () => {
  console.log("Server running at http://127.0.0.1:1000");
});
