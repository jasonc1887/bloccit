const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

    beforeEach((done) => {

        this.topic;
        this.post;
        sequelize.sync({force: true}).then((res) => {

            Topic.create({
                title: "Best bands in the world",
                description: "A list of the greatest bands to ever live."
            })
            .then((topic) => {
                this.topic = topic;

                Post.create({
                    title: "Best punk bands",
                    body: "NOFX, duh.",
                    topicId: this.topic.id
                })
                .then((post) => {
                    this.post = post;
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#create()", () => {

        it("should create a topic object with a title, description and ID", (done) => {

            Topic.create({
                title: "Music genres",
                description: "A list of music genres and sub-genres"
            })
            .then((topic) => {
                expect(topic.title).toBe("Music genres")
                expect(topic.description).toBe("A list of music genres and sub-genres");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a topic without a title or description", (done) => {

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

        it("should return associated posts", (done) => {
               
            this.topic.getPosts()
            .then((associatedPosts) => {
                expect(associatedPosts[0].title).toBe("Best punk bands");
                done();
            });
        });
    });
})