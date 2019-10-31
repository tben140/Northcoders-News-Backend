process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app.js");
const connection = require("../dbconnection.js");
const chai = require("chai");
chai.use(require("chai-sorted"));

describe("app", () => {
  after(() => {
    return connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("NOT A ROUTE", () => {
    it("ERROR: 404 - Route not found", () => {
      return request(app)
        .get("/api/notaroute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found");
        });
    });
  });
  describe("/api", () => {
    describe("GET", () => {
      it("GET:200 - returns an object containing all of the available endpoints", () => {});
    });
    describe("/topics", () => {
      describe("GET", () => {
        it("GET:200 - returns an array of topics", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body: topics }) => {
              expect(topics.topics).to.be.an("array");
              expect(topics.topics.length).to.equal(3);
              topics.topics.forEach(element => {
                expect(element).to.have.keys(["slug", "description"]);
              });
            });
        });
        describe("GET ERRORS", () => {});
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        describe("GET", () => {
          it("GET:200 - returns an object containing username,avatar_url and name where a username that is present in the users table has been passed", () => {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(({ body: users }) => {
                expect(users).to.be.an("object");
                expect(users.users[0]).to.have.keys([
                  "username",
                  "avatar_url",
                  "name"
                ]);
              });
          });
          describe("GET ERRORS", () => {
            it("ERROR: 404 - username not found", () => {
              return request(app)
                .get("/api/users/userthatdoesnotexist")
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("username not found");
                });
            });
          });
        });
      });
    });
    describe("/articles", () => {
      describe("/", () => {
        describe("GET", () => {
          it("GET:200 - returns an array of article objects when no parameters are passed", () => {});
          describe("GET ERRORS", () => {});
        });
      });
      describe("/:article_id", () => {
        describe("GET", () => {
          it("GET:200 - returns an object", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: articles }) => {
                expect(articles).to.be.an("object");
              });
          });
          it("GET:200 - returns an object with the expected keys", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: { article: article } }) => {
                expect(article).to.contain.keys(
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes"
                );
              });
          });
          describe("GET ERRORS", () => {
            it("ERROR: 404 - article_id not found", () => {
              return request(app)
                .get("/api/articles/999")
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("article_id not found");
                });
            });
            it("ERROR: 400 - bad article_id", () => {
              return request(app)
                .get("/api/articles/abc")
                .expect(400)
                .then(({ body }) => {
                  const errMsg = body.msg.split("-")[1];
                  expect(errMsg).to.equal(
                    ' invalid input syntax for type integer: "abc"'
                  );
                });
            });
          });
        });
        describe("PATCH", () => {
          it("PATCH 201 - Update vote value for the specified article_id", () => {
            return request(app)
              .patch("/api/articles/6")
              .send({ inc_votes: 1 })
              .expect(201)
              .then(({ body: { article } }) => {
                // console.log("TEST PATCH body", body);
                // console.log("TEST PATCH Obj", articles);
                // console.log("TEST PATCH inc_votes", inc_votes);
              });
          });
          describe("PATCH ERRORS", () => {});
        });
        describe("POST", () => {
          it("POST:201 - Insert comment for the specified article_id", () => {
            return request(app)
              .post("/api/articles/6/comments")
              .send({ username: "Ben", body: "This is a test comment" })
              .expect(201)
              .then(({ body }) => {
                console.log("INSIDE POST TEST BODY ->", body);
                expect(body).to.be.an("object");
                expect(treasure).to.have.keys(["username", "body"]);
              })
              .then(response => {
                // it("gets the newly inserted comment", () => {
                //   return request(app)
                //     .get("/api/")
                //     .expect(200)
                //     .then(({ body: { treasure } }) => {
                //       expect(treasure).to.be.an("array");
                //       expect(treasure.length).to.equal(27);
                //       treasure.forEach(element => {
                //         expect(element).to.have.keys([
                //           "treasure_id",
                //           "treasure_name",
                //           "colour",
                //           "age",
                //           "cost_at_auction",
                //           "shop_name"
                //         ]);
                //       });
                //       expect(
                //         treasure.includes({
                //           treasure_id: 27,
                //           treasure_name: "newTreasure",
                //           colour: "red",
                //           age: 200,
                //           cost_at_auction: "299.10",
                //           shop_id: 8
                //         })
                //       ).to.be(true);
                //     });
                // });
              });
          });
          describe("POST ERRORS", () => {});
        });
      });
    });
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("PATCH", () => {
          it(
            "PATCH - Returns comment object with a correctly updated votes value"
          );
        });
        describe("DELETE", () => {
          it("DELETE:204 - Successfully removes the comment from the database");
        });
      });
    });
  });
});
