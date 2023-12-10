const {Router} = require("express")
const {Reservation} = require('../models/reservation')
const {Guest} = require('../models/guest')
const {Accommodation} = require('../models/accommodation')
const {countWeekdaysAndWeekends, isOverlap} = require('../utils')

/*
requirement 3 request body sample
 {
    "guest_name":"guest1",
    "accommodation_name":"숙소1",
    "checkin":"2003-11-19T15:00:00.000Z",
    "checkout":"2003-11-20T15:00:00.000Z",
    "reservation_number":"3"
}
*/

const reservation_router = Router()
reservation_router.post("/", async(req, res) => {
    try {
        const {guest_name, accommodation_name, checkin, checkout, reservation_number} = req.body
        const guest = await Guest.findOne({name: guest_name})
        const accommodation = await Accommodation.findOne({name: accommodation_name})

        if(!guest || !accommodation) {
            return res.status(404).send("숙소나 게스트가 없습니다.")
        }

        const temp_checkin= new Date(checkin)
        const temp_checkout = new Date(checkout)
        if(await isOverlap(temp_checkin, temp_checkout, accommodation)) {
            return res.status(400).send("이미 예약된 날짜입니다.")
        }

        const {weekdayCount, weekendCount} = countWeekdaysAndWeekends(temp_checkin, temp_checkout)

        const reservation = new Reservation({
            guest: guest._id,
            accommodation: accommodation._id,
            checkIn: temp_checkin,
            checkOut: temp_checkout,
            reservationNum: reservation_number,
            isCheckOut: false,
            totalPrice: weekdayCount * accommodation.weekdayPrice + weekendCount * accommodation.weekendPrice,
            review: null
        })
        await reservation.save()
        return res.status(200).send('예약 성공')
    } catch (e) {
        console.log(e)
        return res.status(500).send("예약 실패")
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