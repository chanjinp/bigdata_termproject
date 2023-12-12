const {Router} = require("express")
const {Reservation} = require('../models/reservation')
const {Guest} = require('../models/guest')
const {Accommodation} = require('../models/accommodation')
const {countWeekdaysAndWeekends, isOverlap} = require('../utils')
const reservation_router = Router()

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

/*
requirement 4 request url sample
http://127.0.0.1:3000/reservation/6575ab708277cb189321dd73
reserveId는 DB에서 직접 조회 후 입력할 수 있다
*/
reservation_router.delete("/:reservation_id", async(req, res) => {
    try {
        const reservation_id = req.params.reservation_id
        const result = await Reservation.findByIdAndDelete(reservation_id).and({isCheckOut: false})
        if(result != null) {
            res.send("삭제 성공")
        }else {
            res.send("체크아웃이 완료된 예약이므로 삭제 실패")
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("삭제 실패")
    }
})

/*
requirement 5 request url sample
http://127.0.0.1:3000/reservation/guest1?type=all
type = all, oncoming, terminated
*/
reservation_router.get("/:guest_name", async(req, res) => {
    try {
        const guest_name = req.params.guest_name
        const find_type = req.query.type
        let reservations = []
        const guest = await Guest.findOne({name: guest_name})
        if(find_type ==='all') {
            reservations = await Reservation.find({guest: guest._id}).populate('accommodation')
        } else if(find_type === 'oncoming') {
            reservations = await Reservation.find({guest: guest._id, isCheckOut: false}).populate('accommodation')
        } else if(find_type === 'terminated') {
            reservations = await Reservation.find({guest: guest._id, isCheckOut: true}).populate('accommodation')
        } else {
            return res.status(400).send("잘못된 타입입니다.")
        }
        res.send(reservations)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = reservation_router