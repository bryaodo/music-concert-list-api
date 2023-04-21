//concert.js contains api calls for manipulating concert entries, must be a logged in user 
const express = require('express')
const Concert = require('../models/concert')
const auth = require('../middleware/auth')
const router = new express.Router()

/**
 *  create a concert
 *  POST [URL]/concerts
 */
router.post('/concerts', auth, async (req, res) => {
    const concert = new Concert({
        ...req.body,
        owner: req.user._id
    })

    try {
        await concert.save()
        res.status(201).send(concert)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * get all concerts associated with a user. can sort by some sorting methods, e.g:
 * GET [URL]/concerts?limit=10&skip=2
 * GET [URL]/concerts?sortBy=createdAt:desc
 */
router.get('/concerts', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.venue) {
        match.venue = req.query.venue === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'concerts',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.concerts)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

/**
 * find a concert by its id,
 * GET [URL]/concerts/e12ioj419034jrpeja
 */
router.get('/concerts/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const concert = await Concert.findOne({ _id, owner: req.user._id })

        if (!concert) {
            return res.status(404).send()
        }

        res.send(concert)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

/**
 * update a concert by its id. can update name, address, or date attended
 * PATCH [URL]/concerts/e12ioj419034jrpeja
 */
router.patch('/concerts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['concert', 'venue', 'dateAttended']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const concert = await Concert.findOne({ _id: req.params.id, owner: req.user._id})

        if (!concert) {
            return res.status(404).send()
        }

        updates.forEach((update) => concert[update] = req.body[update])
        await concert.save()
        res.send(concert)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

/**
 * delete a concert by its id 
 * DELETE [URL]/concerts/e12ioj419034jrpeja
 */
router.delete('/concerts/:id', auth, async (req, res) => {
    try {
        const concert = await Concert.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!concert) {
            res.status(404).send()
        }

        res.send(concert)
    } catch (e) {
        // console.log(e)
        res.status(500).send()
    }
})

module.exports = router