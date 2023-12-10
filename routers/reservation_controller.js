const {Router} = require("express")
const {Reservation} = require('../models/reservation')
const {Guest} = require('../models/guest')

const reservation_router = Router()
reservation_router.post("/", async(req, res) => {
    try {
        const {guest_name, house_name, checkin, checkout, reservation_number} = req.body
        const guest = await Guest.findOne({name: guest_name})
        const house = await House.findOne({name: house_name})
        if(!guest || !house) {
            return res.status(404).send()
        }
        const reservation = new Reservation({
            guest: guest._id,
            house: house._id,
            checkin,
            checkout,
            reservation_number,
            isCheckOut: false,
            totalPrice: 10000, //TODO: 가격 계산
            review: null
        })
        await reservation.save()
        return res.status(200).send('예약 성공')
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