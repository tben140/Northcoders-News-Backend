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
  it("ERROR: 404 - Route not found", () => {
    return request(app)
      .get("/api/notaroute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("Route not found");
      });
  });
  describe("/api", () => {
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
                // console.log("Users off the body", users.users[0]);
                // console.log("Inside TEST then block ...");
                expect(users).to.be.an("object");
                expect(users.users[0]).to.have.keys([
                  "username",
                  "avatar_url",
                  "name"
                ]);
              });
          });
        });
      });
    });
    describe("/articles", () => {
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
                // console.log("TEST article ->", article);
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
        });
      });
      describe("ERROR", () => {
        it("ERROR: 404 - article_id not found", () => {
          return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("article_id not found");
            });
        });
        it("ERROR: 404 - bad article_id", () => {
          return request(app)
            .get("/api/articles/abc")
            .expect(400)
            .then(({ body }) => {
              const errMsg = body.msg.split("-")[1];
              // console.log("TEST BODY MSG", body.msg);
              expect(errMsg).to.equal(
                ' invalid input syntax for type integer: "abc"'
              );
            });
        });
      });
    });
  });
});
