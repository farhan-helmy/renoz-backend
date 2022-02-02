const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Service = require('../../src/models/service')
const Booking = require('../../src/models/booking')
const {
    nanoid
} = require("nanoid");

const serviceId = new mongoose.Types.ObjectId()
const serviceRefurbish = {
    _id: serviceId,
    service_name: "Refurbish",
    description: "cuci2",
}

const normalUserId = nanoid(5)
const normalUser = {
    _id: normalUserId,
    name: 'farhan',
    email: 'farhan@example.com',
    password: 'ExampleUser123!',
    address: 'jalan bnangi',
    phone_no: 1234145,
    house_type: "kondominium",
    tokens: [{
        token: jwt.sign({ _id: normalUserId }, process.env.JWT_SECRET)
    }]
}

const adminUserId = nanoid(5)
const adminUser = {
    _id: adminUserId,
    name: 'farhan',
    email: 'admin@example.com',
    password: 'ExampleUser123!',
    address: 'jalan bnangi',
    phone_no: 1234145,
    house_type: "kondominium",
    isAdmin: true,
    tokens: [{
        token: jwt.sign({ _id: adminUserId }, process.env.JWT_SECRET)
    }]
}

const bookingId = new mongoose.Types.ObjectId()
const booking = {
    _id : bookingId,
    user: normalUserId,
    service: serviceId
}


const setupDatabase = async () => {
    await User.deleteMany()
    await Service.deleteMany()
    await Booking.deleteMany()
    await new User(normalUser).save()
    await new User(adminUser).save()
    await new Service(serviceRefurbish).save()
    await new Booking(booking).save()
}

module.exports = {
    normalUserId,
    normalUser,
    setupDatabase,
    adminUserId,
    adminUser,
    serviceId,
    serviceRefurbish,
    bookingId
}