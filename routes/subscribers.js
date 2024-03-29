const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')
const repl = require("repl");

// Getting all
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting One
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
})
// Creating One
router.post('/', async (req, res) => {
    const sub = new Subscriber({
        name: req.body.name,
        subscriberToChannel: req.body.subscriberToChannel
    })

    try {
        const newSub = await sub.save()
        res.status(201).json(newSub)
    } catch (err){
        res.status(400).json({message: err.message})
    }
})
// Updating One
router.patch('/:id', getSubscriber, async (req, res) => {
    if(req.body.name != null){
        res.subscriber.name = req.body.name
    }

    if(req.body.subscriberToChannel != null){
        res.subscriber.subscriberToChannel = req.body.subscriberToChannel
    }

    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (err){
        res.status(400).json({message: err.message})
    }
})
// Deleting One
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await res.subscriber.deleteOne()
        res.json({message: 'Deleted Subscriber'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getSubscriber(req, res, next) {
    let subscriber
    try {
        var id = req.params.id
        subscriber = await Subscriber.findById(id)
        if (subscriber == null) {
            return res.status(404).json({message: "Subscriber not found!"})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.subscriber = subscriber
    next()
}

module.exports = router