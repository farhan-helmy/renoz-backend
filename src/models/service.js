const mongoose = require("mongoose");
const validator = require("validator");
const mongooseDateFormat = require('mongoose-date-format')

const serviceSchema = new mongoose.Schema(
  {
    service_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    picture_link: {
        type: String
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'service'
})

serviceSchema.plugin(mongooseDateFormat)

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
