const app = require('./app')

/**
 *Connects application to local port
 * Params: process.env.PORT is a port listed in config files
*/ 
app.listen(process.env.PORT, () => {
    console.log('Server is up on port ' + process.env.PORT)
}) 