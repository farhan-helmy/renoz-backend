const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const Service = require("../models/service");
const { uploadFile, getFileStream } = require("../helpers/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const router = new express.Router();

router.post("/service", auth, async (req, res) => {
  const service = new Service(req.body);
  if (req.user.isAdmin) {
    try {
      await service.save();
      res.status(201).send({
        service,
      });
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.status(401).send();
  }
});

router.get("/services", auth, async (req, res) => {
  try {
    const allService = await Service.find();
    res.status(200).send(allService);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/services/:id", auth, async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id });

    if (!service) {
      return res.status(404).send();
    }

    res.status(200).send(service);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/services/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "service_name"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  if (req.user.isAdmin) {
    try {
      const service = await Service.findOne({ _id: req.params.id });

      if (!service) {
        return res.status(404).send();
      }

      updates.forEach((update) => (service[update] = req.body[update]));
      await service.save();
      res.send(service);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.status(401).send();
  }
});

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
