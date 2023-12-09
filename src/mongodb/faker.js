const faker = require("faker");
const mongoose = require("mongoose");
const { Member, Blog, Comment } = require("./models");

// eslint-disable-next-line no-undef
generateDummyData = async (nMember, nBlogPerMember, nCommentPerMember) => {
    const members = [];
    const blogs = [];
    const comments = [];
    const db = mongoose.connection.db;

    console.log("drop all collections");
    const collections = await db.listCollections().toArray();
    collections
        .map((collection) => collection.name) //["members", "blogs", "comments"]
        .forEach(async (collectionName) => {
            db.dropCollection(collectionName);
        });
    console.log("Generating Dummy data");

    for (let i = 0; i < nMember; i++) {
        members.push(
            new Member({
                name: faker.internet.userName() + parseInt(Math.random() * 100),
                age: 20 + parseInt(Math.random() * 50),
                address: {
                    city: faker.address.city(),
                    street: faker.address.streetName(),
                    zipCode: faker.address.zipCode(),
                },
            })
        );
    }

    members.map(async (member) => { // 1, 5개의 댓글을 쓴다고 가정하면
        for (let i = 0; i < nBlogPerMember; i++) {
            blogs.push(
                new Blog({
                    title: faker.lorem.words(),
                    content: faker.lorem.paragraph(),
                    member,
                    //comments: [],
                })
            );
        }
    });
    members.map((member) => { //회원이, 특정 블로그(중복도 가능한)에 댓글을 5개 쓴다.
        for (let i = 0; i < nCommentPerMember; i++) {
            let index = Math.floor(Math.random() * blogs.length); //blogs에 저장된 임의의 블로그를 지정하는
            comments.push(
                new Comment({
                    content: faker.lorem.sentence(),
                    member: member,
                    blog: blogs[index]._id, //blogs = [1,2,3,4,5,6,7,8,9,10]
                })
            );
        }
    });
    // comments.forEach((comment) => { //모든 comments를 꺼내서
    //    blogs.forEach((blog) => { //꺼낸 블로그의 아이디와 comment 블로그의 아이디가 같으면 넣기
    //        if(comment.blog._id === blog._id) {
    //            blog.comments.push(comment);
    //        }
    //    })
    // });

    console.log("dummpy data inserting....");
    await Member.insertMany(members);
    await Blog.insertMany(blogs);
    await Comment.insertMany(comments);
};

// eslint-disable-next-line no-undef
module.exports = { generateDummyData };
