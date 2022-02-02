require("../db/mongoose");

const User = require("../models/user");
const Service = require("../models/service");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const adminUserId = nanoid(5);
const adminUser = {
  _id: adminUserId,
  name: "farhan",
  email: "admin@example.com",
  password: "ExampleUser123!",
  address: "jalan bnangi",
  phone_no: 1234145,
  house_type: "kondominium",
  isAdmin: true,
  tokens: [
    {
      token: jwt.sign(
        {
          _id: adminUserId,
        },
        process.env.JWT_SECRET
      ),
    },
  ],
};

const normalUserId = nanoid(5);
const normalUser = {
  _id: normalUserId,
  name: "farhan",
  email: "user@example.com",
  password: "ExampleUser123!",
  address: "jalan bnangi",
  phone_no: 1234145,
  house_type: "kondominium",
  isAdmin: false,
  tokens: [
    {
      token: jwt.sign(
        {
          _id: normalUserId,
        },
        process.env.JWT_SECRET
      ),
    },
  ],
};

const serviceId = new mongoose.Types.ObjectId();
const oneService = {
  _id: serviceId,
  service_name: "refurbish",
  description: "dadada",
};

const seed = async () => {
  await User.deleteMany();
  await Service.deleteMany();
  await new User(adminUser).save();
  await new User(normalUser).save();
  await new Service(oneService).save();
  return;
};

module.exports = {
  seed,
};
