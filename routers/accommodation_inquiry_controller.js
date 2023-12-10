const {Router} = require("express")
const {Accommodation} = require('../models/accommodation')
const {Guest} = require('../models/guest')
const {Reservation} = require('../models/reservation')
const {countWeekdaysAndWeekends} = require('../utils');

const accommodationRouter = Router();
let available = [];
const number = 5;

/*
게스트 숙소 조회 검사항목
게스트는 조건에 맞는 숙소를 조회
- 체크인, 체크아웃 날짜는 모든 숙소 체크인 15, 체크아웃 11로 고정
- 인원 입력(개인 숙소는 1인당 방 하나를 사용한다고 가정)
- 숙소 타입(전체, 개인)

- 정렬 [가격, 별점] 순으로 내림차순
- 검색 조건에 맞는 숙소 정보를 보여준다.
 */
const checkIn = new Date('2023-12-01')
const checkOut = new Date('2023-12-05')

const dayCount = countWeekdaysAndWeekends(checkIn, checkOut);
const canReservationCheck = async (checkIn, checkOut) => {
    try {
        const reservations = await Reservation.find({
            $or: [
                {
                    $and: [
                        {checkIn: {$lte: checkIn}},
                        {checkOut: {$gte: checkOut}}
                    ]
                },
                {
                    $and: [
                        {checkIn: {$lte: checkIn}},
                        {checkOut: {$gte: checkOut}}
                    ]
                },
                {
                    $and: [
                        {checkIn: {$gte: checkIn}},
                        {checkOut: {$lte: checkOut}}
                    ]
                }
            ],
            $and: [
                {isCheckOut: true}
            ]
        }).populate({path: "accommodation"});


        // reservations 배열에 접근하여 각 예약과 숙소 정보에 접근
        for (const reservation of reservations) {
            const reservation_num = reservation.reservationNum;
            const accommodation = reservation.accommodation;

            for (const result of available) { // available -> 정렬된 숙소 미리 옮겨둔 배열
                if (accommodation.name === result.name) { //각 예약 테이블에 존재했던 숙소 정보의 이름과 빼온 숙소의 이름이 같은 경우
                    if(result.type === 'Personal') { //개인실이면 차로 넣고
                        result.capacity = accommodation.capacity - reservation_num;
                    }else {
                        result.capacity = 0; //전체 실이면 예약 못하므로 0으로 고정
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
        // 예외가 발생하면 false 반환 또는 적절한 예외 처리 수행
    }
};
//숙소 조건 없이 전체 조회
accommodationRouter.get("/", async (req, res) => {
    try {

        const accommodations = await Accommodation.aggregate([
            {
                $project: {
                    _id: 0,
                    name: 1,
                    type: 1,
                    address: 1,
                    bedroom: 1,
                    bed: 1,
                    bathroom: 1,
                    description: 1,
                    comport: 1,
                    capacity: 1,
                    calculatePrice: {
                        $add: [
                            {$multiply: ["$weekdayPrice", dayCount.weekdayCount]},
                            {$multiply: ["$weekendPrice", dayCount.weekendCount]}
                        ]
                    },
                    avgStar: 1,
                }
            },
            {
                $sort: {calculatePrice: -1, avgStar: -1}
            }
        ]);
        for (const accommodation of accommodations) {
            available.push(accommodation)
        }
        await canReservationCheck(checkIn, checkOut);
        const result = available.filter(item => item.capacity >= number);
        res.status(202).send({result});
        console.log({result});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});
//항상 수용 인원은 5보다 크게 고정
//숙소 타입에 따른 조회 결과 All, Personal
accommodationRouter.get("/houseType", async (req, res) => {
    try {
        const houseType = req.query.type;

        const accommodations = await Accommodation.aggregate([
            {
                $match: {
                    type: houseType,
                    capacity: {$gte: 5}
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    type: 1,
                    address: 1,
                    bedroom: 1,
                    bed: 1,
                    bathroom: 1,
                    description: 1,
                    comport: 1,
                    capacity: 1,
                    calculatePrice: {
                        $add: [
                            {$multiply: ["$weekdayPrice", dayCount.weekdayCount]},
                            {$multiply: ["$weekendPrice", dayCount.weekendCount]}
                        ]
                    },
                    avgStar: 1,
                }
            },
            {
                $sort: {calculatePrice: -1, avgStar: -1}
            }
        ]);
        for (const accommodation of accommodations) {
            available.push(accommodation)
        }
        await canReservationCheck(checkIn, checkOut);
        const result = available.filter(item => item.capacity >= number);
        res.status(202).send({result});
        console.log({result});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});


//sample url
//http://127.0.0.1:3000/accommodation/select_one?name=숙소1
accommodationRouter.get('/select_one', async (req, res) => {
    try {
        const name = req.query.name;
        const accommodation = await Accommodation.findOne({name: name})
        const reservations = await Reservation.find({accommodation: accommodation._id})
        res.status(202).json({accommodation, reservations})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
})

module.exports = accommodationRouter;