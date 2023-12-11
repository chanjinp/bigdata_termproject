const {Router} = require("express")
const {Reservation} = require('../models/reservation');
const { Guest } = require('../models/guest');
const {Review} = require('../models/review');
const review_router = Router();

/*
requirement 6 request body sample
{
    "content": "몽고텀프",
    "star": "4"
}
*/

review_router.post('/writeReview', async (req, res) => {
    try {
        // guest의 이름이 guest1인 경우를 찾음
        const guest = await Guest.findOne({name: 'guest1'});

        // 해당 guest의 리뷰가 작성되지 않은 reservation을 찾음
        const reservation = await Reservation
            .findOne({guest: guest._id, review: null})
            .populate('guest');

        // 해당 reservation이 없으면 에러 메시지 전송
        if (!reservation) {
            return res.status(400).json({message: '리뷰를 작성할 수 있는 예약이 없습니다.'});
        }

        const reviewData = {
            content: req.body.content,
            star: req.body.star
        };

        const review = new Review(reviewData);
        await review.save();

        // 만든 리뷰 정보를 Reservation에 넣음
        reservation.review = review;

        // 변경 사항 DB에 저장
        await reservation.save();

        // 성공 메시지 전송
        res.status(200).json({message: '리뷰가 성공적으로 작성되었습니다.'});

    } catch (error) {
        console.log(error); // 에러 내용 출력
        res.status(500).json({message: '리뷰 작성 중 에러가 발생했습니다.'});
    }

});

module.exports = review_router;