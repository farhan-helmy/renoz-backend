const express = require('express')
const cors = require('cors')
const userRouter = require('./routers/user')
const serviceRouter = require('./routers/service')
const bookingRouter = require('./routers/booking')

require('./db/mongoose')

const app = express()

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(serviceRouter)
app.use(bookingRouter)

module.exports = app