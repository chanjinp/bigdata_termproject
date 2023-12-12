const {Router} = require("express")
const {Reservation} = require('../models/reservation');
const { Guest } = require('../models/guest');
const {Review} = require('../models/review');
const {Accommodation} = require("../models/accommodation");
const review_router = Router();

/*
requirement 6 request body sample
{
    "content": "몽고텀프",
    "star": "4"
}
*/

review_router.post('/:reservation_id', async (req, res) => {
    try {
        const {guest_name, reservation_id, content, star} = req.body;

        // 이름으로 게스트 찾기
        const guest = await Guest.findOne({ name: guest_name });

        if (!guest) {
            return res.status(400).json({ message: '게스트를 찾을 수 없습니다.' });
        }

        // 리뷰가 없는 게스트의 예약 찾기
        const reservations = await Reservation
            .find({ guest: guest._id, review: null })
            .populate('guest');

        for (const reservation of reservations) {
            if (reservation.review === null) {
                console.log("리뷰가 없는 것들:" + reservation._id);
            }
        }

        // 만약 예약이 없으면 에러 메시지 전송
        if (!reservations) {
            return res.status(400).json({ message: '리뷰를 작성할 수 있는 예약이 없습니다.' });
        }

        const reservationWithoutReview
            = reservations.find(reservation => reservation.review === null); //리뷰가 없는 예약 객체

        if(!reservationWithoutReview) {
            return res.status(400).json({message: '모든 예약에 이미 리뷰가 작성되었습니다. '});
        }

        if (reservationWithoutReview.review !== null) {
            return res.status(400).json({ message: '이미 리뷰가 작성된 예약입니다.' });
        }

        const reviewData = {
            content: content,
            star: star
        };

        const accommodation = await Accommodation.findById(reservationWithoutReview.accommodation._id); //리뷰가 등록되는 예약과 관련된 숙소
        const accommodation_all_reservation = await Reservation.find({accommodation: {_id: accommodation._id}}); //해당 숙소의 모든 예약들 가져오기
        let avgStar = 0;
        let cnt = 0;
        for(const target of accommodation_all_reservation) { //숙소에 관련된 모든 예약들의 리뷰 별점을 가져와서 계산
            if(target.review != null) {
                avgStar += target.review.star;
                cnt++;
            }
        }
        avgStar += reviewData.star;
        cnt++;
        avgStar /= cnt; //내가 넣은 별점까지 추가해서 계산 완료
        accommodation.avgStar = Math.floor(avgStar); //숙소의 avgStar에 Set
        await accommodation.save();

        const review = new Review(reviewData);
        await review.save();

        // 리뷰를 예약에 추가
        reservationWithoutReview.review = review;

        // 변경 사항 DB에 저장
        await reservationWithoutReview.save();

        // 성공 메시지 전송
        res.status(200).json({ message: '리뷰가 성공적으로 작성되었습니다.' });

    } catch (error) {
        console.log(error); // 에러 내용 출력
        res.status(500).json({ message: '리뷰 작성 중 에러가 발생했습니다.' });
    }
});

module.exports = review_router;