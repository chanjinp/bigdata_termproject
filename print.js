const printAccommodationInfo = (accommodation) => {
    console.log(`[숙소 이름]: ${accommodation.name}\t[숙소 타입]: ${accommodation.type}\t[주소]: ${accommodation.address}`)
    console.log(`[침실, 침대, 욕실 수]: ${accommodation.bedroom}, ${accommodation.bed}, ${accommodation.bathroom}`)
    console.log(`[설명]: ${accommodation.description}`)
    console.log(`[편의 시설]: ${accommodation.comport}`)
    console.log(`[수용 인원]: ${accommodation.capacity}`)
    console.log(`[가격]: ${accommodation.calculatePrice}`)
    console.log(`[평균 별점]: ${accommodation.avgStar}\n`)
}

const print_reservation_history = (reservations) => {
    console.log("[숙박 완료 리스트]")
    console.log("숙소명\t\t체크인\t\t\t체크아웃\t\t후기")
    reservations.map(reservation => {
        if(reservation.review === null) {
            reservation.review = " X"
        } else {
            reservation.review = " O"
        }
        reservation.checkIn = reservation.checkIn.split("T")[0]
        reservation.checkOut = reservation.checkOut.split("T")[0]
        console.log(`${reservation.accommodation.name}\t\t${reservation.checkIn}\t\t${reservation.checkOut}\t\t${reservation.review}`)
    })
}
module.exports = {
    printAccommodationInfo,
    print_reservation_history
}