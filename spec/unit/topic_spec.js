const sequelize = require("../../src/db/models/index").sequelize;
const Post = require("../../src/db/models").Post;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

describe("Topic", () => {

    beforeEach((done) => {

        this.topic;
        this.post;
        this.user;

        sequelize.sync({force: true})
        .then((res) => {

            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Expeditions to Alpha Centauri",
                    description: "A compilation of reports from recent visits to the star system.",

                    posts: [{
                        title: "My first visit to Proxima Centauri b",
                        body: "I saw some rocks.",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((topic) => {
                    this.topic = topic;
                    this.post = topic.posts[0];
                    done();
                })
            });
        });
    });

    describe("#create()", () => {
        it("should create a topic object with a title and description", (done) => {

            Topic.create({
                title: "Music genres",
                description: "A list of music genres and sub-genres"
            })
            .then((topic) => {
                expect(topic.title).toBe("Music genres");
                expect(topic.description).toBe("A list of music genres and sub-genres");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a topic with missing title or description.", (done) => {
            Topic.create({
                title: "Music genres"
            })
            .then((topic) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Topic.description cannot be null");
                done();
            })
        });
    });


    describe("#getPosts()", () => {
        it("should return the associated posts.", (done) => {
            Post.create({
                title: "Best punk bands",
                body: "NOFX, duh",
                topicId: this.topic.id,
                userId: this.user.id
            })
            .then((topic) => {
                expect(this.topic.title).toBe("Expeditions to Alpha Centauri");
                expect(this.topic.description).toBe("A compilation of reports from recent visits to the star system.");
                this.topic.getPosts()
                .then((associatedPosts) => {
                    expect(associatedPosts[0].title).toBe("My first visit to Proxima Centauri b");
                    expect(associatedPosts[1].title).toBe("Best punk bands");
                    done();
                })
            })
        });
    });
})