console.log("client is running...");
const {bookHouse, reservationHistory, inquiryAccommodation, inquiryAllTypeAccommodation,
    inquiryPersonalTypeAccommodation, cancelReservation, addComments, houseDetail
} = require("./client_requirement");

const checkin = new Date("2023-12-01");
const checkout = new Date("2023-12-05");

//요구사항 1
// inquiryAccommodation(checkin, checkout, 5, "All");
// inquiryAccommodation(checkin, checkout, 5, "Personal");

//요구사항 2 //TODO 11/30 ~ 12/2의 경우 11월 반영 안됨 - 수정 요망
// houseDetail("숙소3", 12)

//요구사항 3
// bookHouse("guest1", "숙소8", "2023-12-14", "2023-12-20", 2)

//요구사항 4  예약 Object._id 가져와서 입력 필요
// cancelReservation("65793364d50425c52b17f676")

//요구사항 5 [all oncoming terminated]
// reservationHistory("guest1", "all")

//요구사항 6  예약 Object._id와 id에 맞는 guest 이름 가져와서 입력 필요
// ex: addComments("guest8", "Object_id", "리뷰 내용", 별점)
// addComments("guest6", "657931073e5fcd4ca0d0bf25", "몽고", 1)
