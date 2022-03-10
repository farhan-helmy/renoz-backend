const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const bookingController = require("../controllers/booking");

router.post("/booking", auth, bookingController.createBooking);

router.get("/booking", auth, bookingController.getAllBooking);

router.get("/booking/:id", auth, bookingController.getBookingById);

module.exports = router;
