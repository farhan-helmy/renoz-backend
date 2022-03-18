const fs = require("fs");
const sharp = require("sharp");
const util = require("util");
const { uploadFile, getFileStream, deleteFile } = require("../helpers/s3");
const unlinkFile = util.promisify(fs.unlink);
const Service = require("../models/service");

const createService = async (req, res) => {
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
}

const getAllServices = async (req, res) => {
  try {
    const allService = await Service.find();
    res.status(200).send(allService);
  } catch (e) {
    res.status(400).send(e);
  }
}

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id });

    if (!service) {
      return res.status(404).send();
    }

    res.status(200).send(service);
  } catch (e) {
    res.status(400).send(e);
  }
}

const updateService = async (req, res) => {
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
}

const updateServiceImage = async (req, res) => {
  //console.log(req)
  const file = req.file
  const service = await Service.findOne({ _id: req.params.id });
  if (!service) {
    return res.status(404).send();
  }

  if (service.picture_link) {
    await deleteFile(service.picture_link)
  }

  await uploadFile(file.path, file.filename)
  await unlinkFile(file.path);
  
  service["picture_link"] = file.filename
  await service.save()
  res.send(service);
}

const getImage = (req, res) => {
  //console.log(req.params)

  const key = req.params.key
  const readStream = getFileStream(key)
  // console.log({readStream})
  readStream
  .on('error', error => {
    console.log(error)
    return res.status(400).send({
      error: error.message,
    })
  })
  .pipe(res)
  // readStream.pipe(res)
}

const deleteImage = async (req, res) => {

  try {
    
    const service = await Service.findOne({ _id: req.params.id });

    if (!service) {
      return res.status(404).send();
    }
    
    if (service.picture_link) {
      await deleteFile(service.picture_link)
      service.picture_link = undefined
      await service.save()
    }

    res.send(service)

  } catch (error) {
    console.log({error})
    res.status(400).send({
      error: error.message,
    })
  } finally {
    res.status(400).send()
  }
}

const routeHandler = (error, req, res, next) => {
  res.status(400).send({
    error: error.message,
  });
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  updateServiceImage,
  getImage,
  deleteImage,
  routeHandler
}