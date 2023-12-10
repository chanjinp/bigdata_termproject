const {Router} = require("express")
const {Accommodation} = require('../models/accommodation')
const {Guest} = require('../models/guest')
const {Reservation} = require('../models/reservation')
const {countWeekdaysAndWeekends} = require('../utils');

const accommodationRouter = Router();

/*
게스트 숙소 조회 검사항목
게스트는 조건에 맞는 숙소를 조회
- 체크인, 체크아웃 날짜는 모든 숙소 체크인 15, 체크아웃 11로 고정
- 인원 입력(개인 숙소는 1인당 방 하나를 사용한다고 가정)
- 숙소 타입(전체, 개인)

- 정렬 [가격, 별점] 순으로 내림차순
- 검색 조건에 맞는 숙소 정보를 보여준다.
 */
const checkIn = new Date('2023-12-10')
const checkOut = new Date('2023-12-15')


//숙소 조건 없이 전체 조회
accommodationRouter.get("/", async (req, res) => {
    try {
        const {houseType} = req.params;
        const accommodations = await Accommodation.find({})
        res.status(202).json({accommodations})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
//숙소 타입에 따른 조회 결과 All, Personal
accommodationRouter.get("/:houseType", async (req, res) => {
    try {
        const {houseType} = req.params;
        const accommodations = await Accommodation.find(
            {capacity: {$gte: 5}, type: `${houseType}` })
        res.status(202).json({accommodations})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
//TODO 정렬 해야함
module.exports = accommodationRouter;