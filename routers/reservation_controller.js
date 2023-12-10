const {Router} = require("express")
const {Reservation} = require('../models/reservation')
const {Guest} = require('../models/guest')

const reservation_router = Router()
reservation_router.post("/", async(req, res) => {
    try {
        const {guest_id, house_id, checkin, checkout, reservation_number} = req.body
        let guest = Guest.findByName(guest_id)
        if(!guest) {
            res.status(400).send({error:"guest does not exist"})
        }
        console.log(guest_id, house_id, checkin, checkout, reservation_number)
        res(200).send(123)
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