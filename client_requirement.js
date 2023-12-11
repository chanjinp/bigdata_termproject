const axios = require("axios");
const {print_reservation_history, printAccommodationInfo} = require("./print")

//요구사항 1번 - 조건에 맞는 숙소 조회하기
const inquiryAccommodation = async (checkIn, checkOut, number, houseType) => {
    try {
        const data = {checkIn: checkIn, checkOut: checkOut, number: number, houseType:houseType}
        const response = await axios.post("http://127.0.0.1:3000/accommodation/", data);
        const accommodations = response.data.result;
        for(let i = 0; i< accommodations.length; i++) {
            printAccommodationInfo(accommodations[i])
        }
    } catch (error) {
        console.error("Error in inquiryAccommodation:", error);
    }
}

const inquiryAllTypeAccommodation = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:3000/accommodation/houseType?type=All");
        const accommodations = response.data.result;
        for(let i = 0; i< accommodations.length; i++) {
            printAccommodationInfo(accommodations[i])
        }
    } catch (error) {
        console.error("Error in inquiryAccommodation:", error);
    }
}

const inquiryPersonalTypeAccommodation = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:3000/accommodation/houseType?type=Personal");
        const accommodations = response.data.result;
        for(let i = 0; i< accommodations.length; i++) {
            printAccommodationInfo(accommodations[i])
        }
    } catch (error) {
        console.error("Error in inquiryAccommodation:", error);
    }
}

//요구사항 3번 - 숙소 예약하기
async function bookHouse(guest_name, accommodation_name, checkin, checkout, reservation_number) {
    console.log("bookHouse is running...")
    const data = {
        guest_name: guest_name,
        accommodation_name: accommodation_name,
        checkin: checkin,
        checkout: checkout,
        reservation_number: reservation_number
    }
    try {
        const res = await axios.post("http://127.0.0.1:3000/reservation/", data)
            .then(res => {
                console.log(res.data)
            })
    } catch (e) {
        console.log("예약 실패")
    }
}
//요구사항 4번 예약 취소하기
const cancelReservation = async (reservation_id) => {
    try {
        const res = await axios.delete(`http://127.0.0.1:3000/reservation/${reservation_id}`)
            .then(res => {
                console.log(res.data)
            })
    } catch (e) {
        console.log("삭제 실패")
    }
}
//요구사항 5번 예약 내역 조회하기
async function reservationHistory(guest_name, type) {
    console.log("reservationHistory is running...")
    try {
        await axios.get(`http://127.0.0.1:3000/reservation/${guest_name}?type=${type}`)
            .then(res => res.data).then(data => {
                print_reservation_history(data)
            })
    } catch (e) {
        console.log("예약 내역 조회 실패")
    }
}
//TODO 요구사항 6번 리뷰 작성하기

module.exports = {
    inquiryAccommodation,
    inquiryAllTypeAccommodation,
    inquiryPersonalTypeAccommodation,
    bookHouse,
    reservationHistory,
    cancelReservation
}