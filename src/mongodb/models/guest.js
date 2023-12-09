const {Schema, model, Types} = require("mongoose")
const mongoose = require("mongoose");

const GuestSchema = new Schema(
    {
        name: {type: String,  required: true}, //이름
    },
    {timestamps: true} //mapped Superclass처럼 공통 속성을 묶어주는 것처럼 사용
)
const Guest = mongoose.model("Guest", GuestSchema);
module.exports(Guest);