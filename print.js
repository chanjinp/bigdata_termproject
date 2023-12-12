const printAccommodationInfo = (accommodation) => {
    console.log(`[숙소 이름]: ${accommodation.name}\t[숙소 타입]: ${accommodation.type}\t[주소]: ${accommodation.address}`)
    console.log(`[침실, 침대, 욕실 수]: ${accommodation.bedroom}, ${accommodation.bed}, ${accommodation.bathroom}`)
    console.log(`[설명]: ${accommodation.description}`)
    console.log(`[편의 시설]: ${accommodation.comport}`)
    console.log(`[수용 인원]: ${accommodation.capacity}`)
    console.log(`[가격]: ${accommodation.calculatePrice}`)
    console.log(`[평균 별점]: ${accommodation.avgStar}\n`)
}

const printDetailAccommodationInfo = (accommodation) => {
    console.log(`[숙소 이름]: ${accommodation.name}\t[숙소 타입]: ${accommodation.type}\t[주소]: ${accommodation.address}`)
    console.log(`[침실, 침대, 욕실 수]: ${accommodation.bedroom}, ${accommodation.bed}, ${accommodation.bathroom}`)
    console.log(`[설명]: ${accommodation.description}`)
    console.log(`[편의 시설]: ${accommodation.comport}`)
    console.log(`[수용 인원]: ${accommodation.capacity}`)
    console.log(`[주중 가격]: ${accommodation.weekdayPrice}`)
    console.log(`[주말 가격]: ${accommodation.weekendPrice}`)
    console.log(`[평균 별점]: ${accommodation.avgStar}\n`)
}

const printReview = (reservations) => {
    // 리뷰가 존재하는 예약만 선택
    const reservationsWithReview = reservations.filter(reservation => reservation.review);

    reservationsWithReview.forEach(reservation => {
        console.log(`
            [별점]: ${reservation.review.star}
            [리뷰 내용]: ${reservation.review.content}
        `);
    });
};

const printCal = (reservations, month, type, capacity) => {
    const now = new Date();
    const year = new Date().getFullYear()
    const startDay = new Date(`${year}-${month}-01`);
    const endDay = new Date(year, month, 0)
    const last_day = endDay.getDate()
    let day_cnt_array = null
    if(type === 'All') {
        // day_cnt_array = new Array(last_day + 1).fill("*")
        day_cnt_array = new Array(last_day).fill("*")
    } else {
        day_cnt_array = new Array(last_day).fill(capacity)
        // day_cnt_array = new Array(last_day + 1).fill(capacity)
    }

    reservations.map(res => {
        let checkin = new Date(res.checkIn)
        const checkout = new Date(res.checkOut)
        if(startDay <= checkout && endDay >= checkin) {

            while(checkin < checkout) {
                if(checkin.getMonth() === checkout.getMonth()) {
                    if(type === 'All') {
                        day_cnt_array[checkin.getDate()] = "O"
                    } else {
                        day_cnt_array[checkin.getDate()] = day_cnt_array[checkin.getDate()] - res.reservationNum
                    }
                }
                checkin = new Date(checkin.getFullYear(), checkin.getMonth(), checkin.getDate() + 1)
            }
        }
    })

    const days = ['일', '월', '화', '수', '목', '금', '토'];

    let calendar = ''
    calendar += `${year}년 ${month}월\n`;
    calendar += days.join(' ') + '\n';
    const firstDayOfMonth = startDay.getDay()
    const daysInMonth = endDay.getDate()
    let temp = 0
    let first_white_space = ''
    for (let i = 0; i < firstDayOfMonth; i++) {
        first_white_space += '   ';
    }
    calendar += first_white_space
    for (let day = 1; day <= daysInMonth; day++) {
        // 한 자리 숫자는 공백 추가하여 정렬
        const dayString = day < 10 ? ' ' + day : '' + day;
        calendar += `${dayString} `;

        // 토요일마다 줄바꿈
        if ((firstDayOfMonth + day) % 7 === 0) {
            calendar += '\n';
            if(day <= firstDayOfMonth) {
                calendar += first_white_space + " "
                for(let j = 1; j <= 7 - firstDayOfMonth; j++) {
                    calendar += day_cnt_array[j] + "  "
                }
                calendar += "\n====================\n"
            } else {
                calendar += " "
                let j = day - 6
                let k = 7
                while(k > 0) {
                    if(j > day) {
                        break
                    }
                    calendar += day_cnt_array[j] + "  "
                    k -= 1
                    j += 1
                }
                calendar += "\n====================\n"
            }
            temp = day
        }
    }
    calendar += '\n '
    while(temp + 1 <= last_day) {
        calendar += day_cnt_array[temp] + " "
        temp += 1
    }
    console.log(calendar)
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
    printDetailAccommodationInfo,
    print_reservation_history,
    printReview,
    printCal
}