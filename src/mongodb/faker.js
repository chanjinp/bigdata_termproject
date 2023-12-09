const faker = require("faker");
const mongoose = require("mongoose");
const { Accommodation, Guest, Reservation, Review } = require("./models");

// eslint-disable-next-line no-undef
generateDummyData = async (nAccommodation, nGuest, nReservation, nReview) => {
    const accommodations = [];
    const guests = [];
    const reservations = [];
    const reviews = [];

    //dummyComponent
    const accomodationType = ['All', 'All', 'All', 'All', 'All', 'Personal', 'Personal', 'Personal', 'Personal', 'Personal'];
    const checkIn = new Date('2023-12-01');
    const checkOut = new Date('2023-12-05');


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
        faker.locale = "ko";
        accommodations.push(
            new Accommodation({
                name: faker.lorem.word(),
                type: accomodationType[i],
                address: faker.internet.address(),
                bedroom: faker.number(),
                bed: 5,
                bathroom: 2,
                description: '좋음',
                comport: '기본,게스트검색,안전,접근성',
                number: 10,
                weekdayPrice: 50000,
                weekendPrice: 80000,
            })
        );
    }
    //게스트 등록
    for (let i = 0; i<nGuest; i++) {
        faker.locale = "ko";
        const firstName = faker.name.firstName();
        const lastName = faker.name.LastName();
        const fullName = firstName + lastName;
        guests.push (
            new Guest( {
                name: fullName,
            })
        )
    }
    //숙소 당 예약 3개
    accommodations.map(async (accommodation) => {
        for( let i = 0; i < nReservation; i++) {
            reservations.push(
                new Reservation({
                    guest: guests[Math.random()*nGuest],
                    accommodation: accommodation,
                    review: null,
                    totalPrice: 50000  + 80000,
                })
            )
        }
    })
    //숙소 후기 3개 생성


    console.log("dummpy data inserting....");
    await Accommodation.insertMany(accommodations);
    await Guest.insertMany(guests);
};

// eslint-disable-next-line no-undef
module.exports = { generateDummyData };
