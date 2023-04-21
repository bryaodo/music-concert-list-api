const mongoose = require('mongoose')

/**
 * define database schema for storing concerts
 */
const concertSchema = new mongoose.Schema({
    concert: { //name of concert
        type: String,
        required: true,
        trim: true
    },
    venue: { //address of venue
        type: String,
        required: true,
        trim: true
    },
    dateAttended: { //date of concert attended in numerical format
        type: Date, 
        required: true,
        trim: true
    },
    owner: { //attaches concert to user
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true //set timestamps in request
})

const Concert = mongoose.model('Concert', concertSchema) //initialize the concert schema for use in other files

module.exports = Concert