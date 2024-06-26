const faker = require("faker");
const mongoose = require("mongoose");
const {Accommodation, Guest, Reservation, Review} = require("./models");
const fs = require('fs');
const {generateCheckInDate, countWeekdaysAndWeekends, generateCheckOutDate, generateThisMonthDate} = require('./utils')
const file_path = `./accommodation.txt`

const checkInStart_range = ['2023-01-02','2023-02-02','2023-03-02','2023-04-02','2023-05-02','2023-06-02','2023-07-02','2023-08-02','2023-09-02','2023-10-02','2023-11-02','2023-12-02'];
const checkInEnd_range = ['2023-01-25','2023-02-20','2023-03-25','2023-04-25','2023-05-25','2023-06-25','2023-07-25','2023-08-25','2023-09-25','2023-10-25','2023-11-25','2023-12-25'];

function readAccommodationName(filePath, callback) {
    // 파일 읽기
    fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            // 파일 읽기 오류 처리
            callback(err, null);
            return;
        }

        // 각 줄을 배열로 분할하고 스트링 배열로 변환
        const stringArray = data.split(',');

        // 결과를 콜백 함수에 전달
        callback(null, stringArray);
    });
}

generateDummyData = async (nAccommodation, nGuest, nReservation) => {
    const accommodations = [];
    const guests = [];
    const reservations = [];
    const reviews = [];
    let accommodationName = [];
    try {
        accommodationName = await new Promise((resolve, reject) => {
            readAccommodationName(file_path, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    } catch (err) {
        console.error('파일 읽기 오류', err);
        return;
    }
    //dummyComponent
    const accommodationType = ['All', 'All', 'All', 'All', 'All', 'Personal', 'Personal', 'Personal', 'Personal', 'Personal'];
    const guestName = ['guest1', 'guest2','guest3','guest4','guest5','guest6','guest7', 'guest8','guest9','guest10'];
    //편의 시설
    const basic = '화장지, ' +
        '손과 몸을 씻을 수 있는 비누, ' +
        '게스트당 수건 1장, ' +
        '침대당 침구 1세트, ' +
        '게스트당 베개 1개, ' +
        '청소용품'

    const guestSearch = '수영장, ' +
        '와이파이, ' +
        '주방, ' +
        '무료 주차 공간, ' +
        '자쿠지, ' +
        '세탁기 또는 건조기, ' +
        '에어컨 또는 난방, ' +
        '셀프 체크인, ' +
        '노트북 작업 공간, ' +
        '반려동물 동반 가능'

    const safety = '일산화탄소 경보기, ' +
        '화재 경보기, ' +
        '소화기, ' +
        '구급상자, ' +
        '비상 대피 안내도 및 현지 응급 구조기관 번호'

    const access = '계단이나 단차가 없는 현관, ' +
        '폭 32인치/81cm 이상의 넓은 출입구, ' +
        '폭 36인치/91cm 이상의 넓은 복도, ' +
        '휠체어 접근 가능 욕실'
    const comport = [basic, guestSearch, safety, access]

    //체크인, 체크아웃 랜덤 생성
    faker.locale = "ko";
    const db = mongoose.connection.db;

    console.log("drop all collections");
    const collections = await db.listCollections().toArray();
    collections
        .map((collection) => collection.name) //["guests", "accommodations", "reservations", "reviews"]
        .forEach(async (collectionName) => {
            db.dropCollection(collectionName);
        });
    console.log("Generating Dummy data");

    //숙소 10개 등록
    for (let i = 0; i < nAccommodation; i++) {
        const bedNum = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
        const randomIdx = Math.floor(Math.random() * 4);
        accommodations.push(
            new Accommodation({
                name: accommodationName[i],
                type: accommodationType[i],
                address: faker.address.city(),
                bedroom: bedNum,
                bed: bedNum,
                bathroom: Math.floor(Math.random() * (3 - 1 + 1)) + 1,
                description: faker.commerce.productDescription(),
                comport: comport[randomIdx],
                capacity: bedNum,
                weekdayPrice: Math.floor((Math.random() + 1) * 3) * 10000,
                weekendPrice: Math.floor((Math.random() + 1) * 5) * 10000,
            })
        );
    }
    //게스트 등록
    for (let i = 0; i < nGuest; i++) {
        guests.push(
            new Guest({
                name: guestName[i],
            })
        )
    }

    //숙소 당 예약 7개 체크아웃이 false인 예약 2개, 후기 3개, 후기 없음 2개,
    accommodations.map(async (accommodation) => {
        let i = 0
        let checkInDate;
        let avgStar = 0;
        while (i < nReservation) {

            let randomDateIdx = Math.floor(Math.random()* 11) //idx 0[1월] ~ 11[12월]

            if (i > 3) {
                checkInDate = generateThisMonthDate();
            } else {
                checkInDate = generateCheckInDate(checkInStart_range[randomDateIdx], checkInEnd_range[randomDateIdx]);
            }
            const checkOutDate = generateCheckOutDate(checkInDate);
            const dayCount = countWeekdaysAndWeekends(checkInDate, checkOutDate)

            const availableReservationNum = Math.min(accommodation.capacity, Math.floor(Math.random() * accommodation.capacity) + 1);

            const isOverlap = reservations.some(existingReservation => {
                const existingCheckIn = existingReservation.checkIn;
                const existingCheckOut = existingReservation.checkOut;

                return (
                    (checkInDate >= existingCheckIn && checkInDate < existingCheckOut) ||
                    (checkOutDate > existingCheckIn && checkOutDate <= existingCheckOut) ||
                    (checkInDate <= existingCheckIn && checkOutDate >= existingCheckOut)
                );
            });

            const isTypeAll = reservations.some(reservation =>
                reservation.accommodation._id === accommodation._id && reservation.accommodation.type === 'All'
            );

            if (!isOverlap || !isTypeAll) {

                const review = i < 3 ? new Review({
                    star: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
                    content: faker.lorem.words(),
                }) : null;
                let newReservation = null;
                if(i <= 4) {
                     newReservation = new Reservation({
                        guest: guests[Math.floor(Math.random() * nGuest)]._id,
                        accommodation: accommodation,
                        review: review,
                        totalPrice: accommodation.weekdayPrice * dayCount.weekdayCount + accommodation.weekendPrice * dayCount.weekendCount,
                        reservationNum: availableReservationNum,
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        isCheckOut: true,
                    });
                }else {
                     newReservation = new Reservation({
                        guest: guests[Math.floor(Math.random() * nGuest)]._id,
                        accommodation: accommodation,
                        review: review,
                        totalPrice: accommodation.weekdayPrice * dayCount.weekdayCount + accommodation.weekendPrice * dayCount.weekendCount,
                        reservationNum: availableReservationNum,
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        isCheckOut: false,
                    });
                }

                reservations.push(newReservation);
                if (review != null) {
                    avgStar = avgStar + review.star;
                    reviews.push(review)
                }
                i = i + 1
            }
        }
        accommodation.avgStar = Math.floor(avgStar/3);
    });


    console.log("dummpy data inserting....");
    await Accommodation.insertMany(accommodations);
    await Guest.insertMany(guests);
    await Reservation.insertMany(reservations);
    await Review.insertMany(reviews);
}

// eslint-disable-next-line no-undef
module.exports = {generateDummyData};