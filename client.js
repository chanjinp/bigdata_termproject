console.log("client is running...");
const {bookHouse, reservationHistory, inquiryAccommodation, inquiryAllTypeAccommodation,
    inquiryPersonalTypeAccommodation, cancelReservation, addComments, houseDetail
} = require("./client_requirement");

const checkin = new Date("2023-12-01");
const checkout = new Date("2023-12-05");

//요구사항 1
//inquiryAccommodation(checkin, checkout, 5, "All");
//inquiryAccommodation(checkin, checkout, 5, "Personal");

//요구사항 2
//houseDetail("숙소1", 12)

//요구사항 3
// bookHouse("guest1", "숙소8", "2023-12-10", "2023-12-13", 2)

//요구사항 4  예약 Object._id 가져와서 입력 필요
// cancelReservation("6577e8340024430681dbb7aa")

//요구사항 5
// reservationHistory("guest1", "terminated")

//요구사항 6  예약 Object._id 가져와서 입력 필요
addComments("guest2", "657818dc6b3835cbd4b039c9", "몽고", 1)
