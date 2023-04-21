const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Concert = require('./concert')

/**
 * define database schema for storing users
 */
const userSchema = new mongoose.Schema({
    name: { //name of the user
        type: String,
        required: true,
        trim: true
    },
    email: { //email address of the user
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) { //checks for email formatting
                throw new Error('Email is invalid')
            }
        }
    },
    password: { //password of user, >9 characters and cannot contain the word "password"
        type: String,
        required: true,
        minlength: 9,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: { //age of user, defaults to 18 if not given
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{ //token for login
        token: {
            type: String,
            required: true
        }
    }],
    avatar: { //avatar image of user
        type: Buffer
    }
}, {
    timestamps: true
})

//establish concert relationship
userSchema.virtual('concerts', { 
    ref: 'Concert',
    localField: '_id',
    foreignField: 'owner'
})

//set fields given from request to a json object
userSchema.methods.toJSON = function () { 
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//use the user id and web token to generate a token for login
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//find credenials and return the user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user Concerts when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Concert.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User