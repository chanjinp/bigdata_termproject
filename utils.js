const faker = require("faker");
const {Reservation} = require('./models/reservation')
const generateCheckInDate = () => {
    const checkInDate = faker.date.between('2023-01-01', '2023-12-05');
    checkInDate.setHours(0, 0, 0, 0)
    return checkInDate
};
const generateThisMonthDate = () => {
    const checkInDate = faker.date.between('2023-11-20', '2023-12-05');
    checkInDate.setHours(0, 0, 0, 0)
    return checkInDate
}
const generateCheckOutDate = (checkInDate) => {
    const maxCheckOutDate = new Date(checkInDate.getTime() + (3 * 24 * 60 * 60 * 1000)); // 예: 3일 이내

    // 체크인 날짜와 체크아웃 날짜가 동일한 경우, 체크아웃 날짜를 하루 뒤로 설정
    if (maxCheckOutDate.getTime() === checkInDate.getTime()) {
        maxCheckOutDate.setDate(maxCheckOutDate.getDate() + 1);
    }

    const checkOutDate = faker.date.between(checkInDate, maxCheckOutDate);
    checkOutDate.setHours(20, 0, 0, 0)
    return checkOutDate
};
//주중, 주말 카운트
const countWeekdaysAndWeekends = (checkInDate, checkOutDate) => {
    let weekdayCount = 0;
    let weekendCount = 0;

    const currentDate = new Date(checkInDate.getTime());

    while (currentDate <= checkOutDate) {
        const dayOfWeek = currentDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // 주중 (월요일부터 금요일까지)
            weekdayCount++;
        } else {
            // 주말 (토요일 또는 일요일)
            weekendCount++;
        }

        // 다음 날짜로 이동
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {weekdayCount, weekendCount};
};

const isOverlap = async (checkin, checkout, accommodation) => {
    const reservations = await Reservation.find({accommodation: accommodation._id, isCheckOut: false})
    if(reservations.length === 0) {
        return false
    }
    console.log(reservations.length)
    return reservations.some(existingReservation => {
        const existingCheckIn = existingReservation.checkIn;
        const existingCheckOut = existingReservation.checkOut;

        return (
        (checkin >= existingCheckIn && checkin < existingCheckOut) ||
        (checkout > existingCheckIn && checkout <= existingCheckOut) ||
        (checkin <= existingCheckIn && checkout >= existingCheckOut)
    )})
};

module.exports = {
    generateCheckInDate,
    generateThisMonthDate,
    generateCheckOutDate,
    countWeekdaysAndWeekends,
    isOverlap
};