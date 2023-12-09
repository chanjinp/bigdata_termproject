const {Schema, model, Types} = require("mongoose")
const mongoose = require("mongoose");

const ReservationSchema = new Schema(
    {
        guest: {type:Types.ObjectId , required: true, ref: "Guest"}, //게스트 아이디
        accommodation: {type:Types.ObjectId , required: true, ref: "Accommodation"}, // 숙소 아이디
        review: {type:Types.ObjectId , required: false, ref: "Review"}, //리뷰 아이디
        totalPrice: {type: Number, required: true}, //총 가격
        reservationNum: {type: Number, required: true}, //예약 인원
        checkIn: {type:Date, required: true}, //체크인
        checkOut: {type:Date, required: true}, //체크아웃
    },
    {timestamps: true} //mapped Superclass처럼 공통 속성을 묶어주는 것처럼 사용
)
const Reservation = mongoose.model("Reservation", ReservationSchema);
module.exports = {Reservation};