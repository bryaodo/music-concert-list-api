const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL) //connects to locally hosted mongoose database