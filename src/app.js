const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const concertRouter = require('./routers/concert')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(concertRouter)

module.exports = app