const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const hostname = "127.0.0.1";
const port = 3000;
const { generateDummyData } = require("./faker");
const reservation_router = require("./routers/reservation_controller");
const accommodation_router = require("./routers/accommodation_inquiry_controller")
const DB_URI = "mongodb://127.0.0.1:27017/mongo_termproject";

const server = async() => {
    try {
        await mongoose.connect(DB_URI); //connect는 비동기 동작
        generateDummyData(10,10,5); // 더미 만들기
        app.use(express.json());
        app.use("/reservation", reservation_router);
        app.use("/accommodation", accommodation_router);
        app.listen(port, hostname, function () {
            console.log("Server is running...");
        }); //서버가 연결을 기다림 -> 포트, 호스트 이름, 콜백 함수
    }catch(err) {
        console.log(err);
    }
}

server();
