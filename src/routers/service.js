const express = require("express");
const auth = require("../middleware/auth");
const servicesController = require("../controllers/services");
const { upload } = require("../middleware/upload");

const router = new express.Router();

router.post("/service", auth, servicesController.createService);

router.get("/services", auth, servicesController.getAllServices);

router.get("/services/:id", auth, servicesController.getServiceById);

router.patch("/services/:id", auth, servicesController.updateService);

router.post("/services/picture/:id", 
  upload.single("image"), 
  servicesController.updateServiceImage,
  servicesController.routeHandler
);

router.get('/images/:key', servicesController.getImage);

router.delete('/services/picture/:id', servicesController.deleteImage);

module.exports = router;
