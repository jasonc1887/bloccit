const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {

    beforeEach((done) => {
        this.advertisement;
        sequelize.sync({force: true}).then((res) => {

            Advertisement.create({
                title: "Code with Node",
                description: "Node is the best!"
            })
            .then((advertisement) => {
                this.advertisement = advertisement;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });
    
    describe("GET /advertisements", () => {

        it("should return a status code 200 and all advertisements", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Advertisements");
                expect(body).toContain("Code with Node");
                done();
            });
        });
    });

    describe("GET /advertisements/new", () => {
        it("should render a new advertisement form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Advertisement");
                done();
            });
        });
    });

    describe("POST /advertisements/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "green day songs",
                description: "What's your favorite green day song?"
            }
        };

        it("should create a new topic and redirect", (done) => {
            request.post(options,
                (err, res, body) => {
                    Advertisement.findOne({where: {title: "green day songs"}})
                    .then((advertisement) => {
                        expect(res.statusCode).toBe(303);
                        expect(advertisement.title).toBe("green day songs");
                        expect(advertisement.description).toBe("What's your favorite green day song?");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                }
            );
        });
    });

    describe("GET /advertisements/:id", () => {
        it("should render a view with the selected advertisement", (done) => {
            request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Code with Node");
                done();
            });
        });
    });

    describe("POST /advertisements/:id/destroy", () => {
        it("should delete the topic with the associated ID", (done) => {
            Advertisement.all()
            .then((advertisements) => {
                
                const advertisementCountBeforeDetele = advertisements.length;

                expect(advertisementCountBeforeDetele).toBe(1);

                request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
                    Advertisement.all()
                    .then((advertisements) => {
                        expect(err).toBeNull();
                        expect(advertisements.length).toBe(advertisementCountBeforeDetele - 1);
                        done();
                    })
                });
            });
        });
    });

    describe("GET /advertisements/:id/edit", () => {
        it("should render a view with an edit advertisement form", (done) => {
            request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Advertisement");
                expect(body).toContain("Code with Node");
                done();
            });
        });
    });

    describe("POST /advertisements/:id/update", () => {

        it("should update the advertisement with the given values", (done) => {
           const options = {
              url: `${base}${this.advertisement.id}/update`,
              form: {
                title: "JavaScript Frameworks",
                description: "There are a lot of them"
              }
            };
            request.post(options,
              (err, res, body) => {
   
              expect(err).toBeNull();
              Advertisement.findOne({
                where: { id: this.advertisement.id }
              })
              .then((advertisement) => {
                expect(advertisement.title).toBe("JavaScript Frameworks");
                done();
              });
            });
        });
   
      });
});

