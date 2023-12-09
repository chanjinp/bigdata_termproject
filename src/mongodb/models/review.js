const {Schema, model, Types} = require("mongoose")
const mongoose = require("mongoose");

const ReviewSchema = new Schema(
    {
        guest: {type:Types.ObjectId , required: true, ref: "Guest"}, //게스트 아이디
        reservation: {type:Types.ObjectId, required: true, ref: "Reservation"}, //예약 번호
        content: {type:String, required: true}, //리뷰 내용
        star: {type: Number, required: true},// 별점
    },
    {timestamps: true} //mapped Superclass처럼 공통 속성을 묶어주는 것처럼 사용
)
const Review = mongoose.model("Review", ReviewSchema);
module.exports(Review);