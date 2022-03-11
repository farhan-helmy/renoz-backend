const express = require("express");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const servicesController = require("../controllers/services");
const { uploadFile, getFileStream } = require("../helpers/s3");
const { upload } = require("../middleware/upload");

const router = new express.Router();

router.post("/service", auth, servicesController.createService);

router.get("/services", auth, servicesController.getAllServices);

router.get("/services/:id", auth, servicesController.getServiceById);

router.patch("/services/:id", auth, servicesController.updateService);

router.post(
  "/services/picture/:id",
  upload.single("image"),
  servicesController.updateServiceImage,
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);

router.get('/images/:key', (req, res) => {
  //console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)
  
  readStream.pipe(res)
})

module.exports = router;
