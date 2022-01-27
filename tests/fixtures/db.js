const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Service = require('../../src/models/service')
const {
    nanoid
} = require("nanoid");

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

const setupDatabase = async () => {
    await User.deleteMany()
    await Service.deleteMany()
    await new User(normalUser).save()
    await new User(adminUser).save()
}

module.exports = {
    normalUserId,
    normalUser,
    setupDatabase,
    adminUserId,
    adminUser
}