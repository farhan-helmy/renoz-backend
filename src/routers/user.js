const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const usersController = require("../controllers/users");
const Service = require("../models/service");
const router = new express.Router();

router.post("/users", usersController.createUser);

router.get("/users/all", auth, usersController.getAllUsers);

router.post("/users/login", usersController.loginUser);

router.post("/users/logout", auth, usersController.logoutUser);

router.get("/users/me", auth, usersController.getMe);

router.patch("/users/me", auth, usersController.updateMe);

router.delete("/users/me", auth, usersController.deleteMe);

module.exports = router;