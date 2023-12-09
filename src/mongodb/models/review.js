const {Schema, model, Types} = require("mongoose")
const mongoose = require("mongoose");

const ReviewSchema = new Schema(
    {
        content: {type:String, required: true}, //리뷰 내용
        star: {type: Number, required: true},// 별점
    },
    {timestamps: true} //mapped Superclass처럼 공통 속성을 묶어주는 것처럼 사용
)
const Review = mongoose.model("Review", ReviewSchema);
module.exports = {Review, ReviewSchema};