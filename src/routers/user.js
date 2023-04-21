const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user.js')
const Concert = require('../models/concert.js')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

/**
 * create a user
 * POST [URL]/users
 */
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * log in a user
 * POST [URL]/users/login/
 */
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

/**
 * log out of current session
 * POST [URL]/users/logout/
 */
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * log out of all sessions on all devices
 * POST [URL]/users/logoutAll/
 */
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * get user information such as name, email, password, or age, user creation date, and last updated date
 * GET [URL]/users/me/
 */
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

/**
 * update user information, such as name, email, password, or age
 * PATCH [URL]/users/me/
 */
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * deletes the user and all concerts tied to user is
 * DELETE [URL]/users/me/
 */
router.delete('/users/me', auth, async (req, res) => {
    try {     
        await Concert.deleteMany({ owner: req.user._id }) //delete concerts
        await User.deleteOne(req.user._id ) //delete user
        // await User.delete()
        // await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name) //send email to user
        res.send(req.user) //send response
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * uses multer to set constraints for uploaded files, such as size and format
 */
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})
/**
 * upload the avatar of the user by user id
 * POST [URL]/me/avatar
 */
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

/**
 * delete the avatar of the user by user id
 * DELETE [URL]/users/fasio3jo21/avatar
 */
router.delete('/users/me/avatar', auth, async (req, res) => {
    if (!req.user.avatar) {
        res.status(400).send({error: "No avatar associated with this user."})
    }
    else {
    req.user.avatar = undefined
    }
    await req.user.save()
    res.send()
})

/**
 * get the avatar of the user by user id
 * GET [URL]/users/fasio3jo21/avatar
 */
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router