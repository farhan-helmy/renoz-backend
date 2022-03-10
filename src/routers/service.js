const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const servicesController = require("../controllers/services");
const { uploadFile, getFileStream } = require("../helpers/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const router = new express.Router();

router.post("/service", auth, servicesController.createService);

router.get("/services", auth, servicesController.getAllServices);

router.get("/services/:id", auth, servicesController.getServiceById);

router.patch("/services/:id", auth, servicesController.updateService);

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  dest: "uploads/",
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/services/picture/:id",
  upload.single("image"),
  async (req, res) => {
    //console.log(req)
    const file = req.file
    const result = await uploadFile(file);
    //console.log(result)
    await unlinkFile(file.path);
    const service = await Service.findOne({ _id: req.params.id });

      if (!service) {
        return res.status(404).send();
      }
    
    service["picture_link"] = result.Key
    await service.save()
    res.send(service);
  },
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
