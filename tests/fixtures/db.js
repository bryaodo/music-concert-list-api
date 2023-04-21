const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Concert = require('../../src/models/concert')
/**
 * sets up database with concerts and users for testing
 */
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56whataaaaaa!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: 'myhouseaaaaa099@@',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    concert: 'First concert',
    venue: 'california',
    dateAttended: "02/01/2023",
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    concert: 'Second concert',
    venue: 'florida',
    dateAttended: "02/01/2023",
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    concert: 'Third concert',
    venue: 'new york',
    dateAttended: "02/01/2023",
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Concert.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Concert(taskOne).save()
    await new Concert(taskTwo).save()
    await new Concert(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}