console.log("client is running...");
const axios = require("axios");
const {printAccommodationInfo} = require("./print")
//요구사항 1번 - 조건에 맞는 숙소 조회하기


const inquiryAccommodation = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:3000/accommodation/");
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
// inquiryAccommodation(); //전체
// inquiryAllTypeAccommodation(); // 전체실 타입에 관한
// inquiryPersonalTypeAccommodation() // 개인실 타입에 관한
