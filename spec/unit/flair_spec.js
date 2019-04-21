const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {

    beforeEach((done) => {

        this.topic;
        this.flair;
        sequelize.sync({force: true}).then((res) => {

            Topic.create({
                title: "Colorado Ski Resorts",
                description: "A collection of reviews of the best ski areas in Colorado."
            })
            .then((topic) => {
                this.topic = topic;

                Flair.create({
                    name: "Good",
                    color: "#33FF38",
                    topicId: this.topic.id
                })
                .then((flair) => {
                    this.flair = flair;
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

        it("should create a flair object with a name, color and assigned topic", (done) => {

            Flair.create({
                name: "Bad",
                color: "#E3281F",
                topicId: this.topic.id
            })
            .then((flair) => {
                expect(flair.name).toBe("Bad");
                expect(flair.color).toBe("#E3281F");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a flair with missing name, color or assigned topic", (done) => {

            Flair.create({
                name: "Good"
            })
            .then((flair) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Flair.color cannot be null");
                expect(err.message).toContain("Flair.topicId cannot be null");
                done();
            })
        });
    });

    describe("#setTopic()", () => {
        
        it("should associate a topic and a flair together", (done) => {

            Topic.create({
                title: "Top rated snowboards of 2019",
                description: "A list of the best boards of the year!"
            })
            .then((newTopic) => {

                expect(this.flair.topicId).toBe(this.topic.id);
                this.flair.setTopic(newTopic)
                .then((flair) => {
                    expect(flair.topicId).toBe(newTopic.id);
                    done();
                });
            })
        });
    });

    describe("#getTopic()", () => {

        it("should return the associated topic", (done) => {

            this.flair.getTopic()
            .then((associatedTopic) => {
                expect(associatedTopic.title).toBe("Colorado Ski Resorts");
                done();
            });
        });
    });
});
 