const {Schema, model, Types} = require("mongoose")
const mongoose = require("mongoose");

const AccommodationSchema = new Schema(
    {
        name: {type:String, required: true}, // 숙소 이름
        type: {type: String, enum: ['All', 'Personal'], required: true}, // 숙소 타입
        address: {type: String, required:true}, //주소
        bedroom: {type: Number, required: true}, //침실 수
        bed: {type: Number, required: true}, //침대 수
        bathroom: {type: Number, required: true}, // 화장실 수
        description: {type: String, required: true}, // 설명
        comport: {type: String, required: true}, //편의 시설
        capacity: {type: Number, required:true}, //수용 인원 수
        weekdayPrice: {type: Number, required:true}, //주중 가격
        weekendPrice: {type: Number, required:true}, //주말 가격
        avgStar: {type: Number, default: 0}, //평균 평점
    },
    {timestamps: true} // mapped Superclass처럼 공통 속성을 묶어주는 것처럼 사용
)
const Accommodation = mongoose.model("Accommodation", AccommodationSchema);
module.exports = {Accommodation}