const mongoose = require("mongoose");
const validator = require("validator");

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
    avatar: {
        type: Buffer
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'services'
})

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
