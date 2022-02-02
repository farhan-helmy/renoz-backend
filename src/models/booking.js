const mongoose = require("mongoose");
const validator = require("validator");

const bookingSchema = new mongoose.Schema(
  {
    user: {
        type: String,
        ref: 'User'
    },
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
