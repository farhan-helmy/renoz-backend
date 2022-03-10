const Booking = require("../models/booking");

const createBooking = async (req, res) => {
  const booking = new Booking({
    user: req.user._id,
    service: req.body.service_id,
  });
  try {
    await booking.save();
    res.status(201).send(booking);
  } catch (e) {
    res.status(400).send(e);
  }
}

const getAllBooking = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const booking = await Booking.find({}).populate(["user", "service"]);
      //const bookingInfo = await booking.populate(["user", "service"]);
      res.status(200).send(booking);
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } else {
    res.status(401).send();
  }
}

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id });
    const bookingInfo = await booking.populate(["user", "service"]);
    await res.status(200).send(bookingInfo);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
}

module.exports = {
  createBooking,
  getAllBooking,
  getBookingById,
}