const printAccommodationInfo = (accommodation) => {
    console.log(`[숙소 이름]: ${accommodation.name}\t[숙소 타입]: ${accommodation.type}\t[주소]: ${accommodation.address}`)
    console.log(`[침실, 침대, 욕실 수]: ${accommodation.bedroom}, ${accommodation.bed}, ${accommodation.bathroom}`)
    console.log(`[설명]: ${accommodation.description}`)
    console.log(`[편의 시설]: ${accommodation.comport}`)
    console.log(`[수용 인원]: ${accommodation.capacity}`)
    console.log(`[가격]: ${accommodation.calculatePrice}`)
    console.log(`[평균 별점]: ${accommodation.avgStar}\n`)
}
module.exports = {
    printAccommodationInfo,
}