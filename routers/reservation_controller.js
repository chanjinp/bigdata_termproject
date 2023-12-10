const {Router} = require("express")
const {Reservation} = require('../models/reservation')
const {Guest} = require('../models/guest')

const reservation_router = Router()
reservation_router.post("/", async(req, res) => {
    try {
        const {guest_id, house_id, checkin, checkout, reservation_number} = req.body
        console.log(guest_id, house_id, checkin, checkout, reservation_number)
        return res(200).send()
    } catch (e) {

    }
})
reservation_router.get("/", async(req, res) => {
    try {
        const reservations = await Reservation.find({})
        res.send(reservations)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = reservation_router