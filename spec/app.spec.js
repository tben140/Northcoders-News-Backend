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
              console.log("topics -> ", topics);

              expect(topics).to.be.an("object");
              expect(topics).to.have.keys("topics");
              expect(topics.topics.length).to.equal(3);
              topics.topics.forEach(topic => {
                expect(topic).to.have.keys(["slug", "description"]);
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
                console.log("TEST inside then", users);
                expect(users).to.be.an("object");
                expect(users).to.have.keys(["username", "avatar_url", "name"]);
              });
          });
          describe("GET ERRORS", () => {
            it("ERROR: 404 - username not found", () => {
              return request(app)
                .get("/api/users/userthatdoesnotexist")
                .expect(404)
                .then(({ body }) => {
                  console.log("Then block body ->", body);
                  //Line below not working
                  // expect(body.status).to.equal(404);
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
          it("GET:200 - returns an array of article objects when no parameters are passed", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body }) => {
                console.log("INSIDE POST TEST BODY ->", body);
                expect(body).to.be.an("object");
                expect(body.articles.length).to.equal(12);
                body.articles.forEach(article => {
                  expect(article).to.have.keys([
                    "article_id",
                    "title",
                    "body",
                    "votes",
                    "topic",
                    "author",
                    "created_at",
                    "comment_count"
                  ]);
                });
              });
          });
          it("GET:200 - returns an array of article objects when parameters are passed for every arguement", () => {
            return request(app)
              .get(
                "/api/articles?sort_by=article_id&order=desc&author=butter_bridge&topic=mitch"
              )
              .expect(200)
              .then(({ body }) => {
                console.log("INSIDE POST TEST BODY ->", body);
                expect(body).to.be.an("object");
                expect(body.articles.length).to.equal(3);
                body.articles.forEach(article => {
                  expect(article).to.have.keys([
                    "article_id",
                    "title",
                    "body",
                    "votes",
                    "topic",
                    "author",
                    "created_at",
                    "comment_count"
                  ]);
                });
              });
          });
          describe("GET ERRORS", () => {
            it("ERROR: 400 - sort_by value is not a valid column", () => {});
            it("ERROR: 400 - order value is not 'asc' or 'desc'", () => {});
            it("ERROR: 400 - author value is not in the articles table", () => {});
            it("ERROR: 400 - topic value is not in the articles table", () => {});
            it("ERROR: 200 - author exists but no articles are linked to this author", () => {});
            it("ERROR: 200 - topic exists but no articles are linked to this topic", () => {});
          });
        });
      });
      describe("/:article_id", () => {
        describe("/comments", () => {
          describe("GET", () => {
            it("GET:200 - returns a JSON object of comments with default sorting", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                  console.log("INSIDE POST TEST BODY ->", body);
                  expect(body).to.be.an("object");
                  expect(body.comments.length).to.equal(13);
                  body.comments.forEach(comment => {
                    expect(comment).to.have.keys([
                      "comment_id",
                      "author",
                      "article_id",
                      "votes",
                      "created_at",
                      "body"
                    ]);
                  });
                });
            });
            it("GET:200 - returns a JSON object of comments sorted by votes in descending order", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes&order=desc")
                .expect(200)
                .then(({ body }) => {
                  console.log("INSIDE POST TEST BODY ->", body);
                  expect(body).to.be.an("object");
                  expect(body.comments.length).to.equal(13);
                  body.comments.forEach(comment => {
                    expect(comment).to.have.keys([
                      "comment_id",
                      "author",
                      "article_id",
                      "votes",
                      "created_at",
                      "body"
                    ]);
                  });
                  expect(body.comments[0]).to.eql({
                    comment_id: 3,
                    author: "icellusedkars",
                    article_id: 1,
                    votes: 100,
                    created_at: "2015-11-23T12:36:03.389Z",
                    body:
                      "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
                  });
                  expect(body.comments[body.comments.length - 1]).to.eql({
                    comment_id: 4,
                    author: "icellusedkars",
                    article_id: 1,
                    votes: -100,
                    created_at: "2014-11-23T12:36:03.389Z",
                    body:
                      " I carry a log — yes. Is it funny to you? It is not to me."
                  });
                });
            });
            describe("GET ERRORS", () => {
              //Complete the following tests, the code for these tests will also be useful in the POST errors
              it("ERROR: 400 - Bad article_id", () => {});
              it("ERROR: 404 - article_id not found", () => {});
            });
          });
          describe("POST", () => {
            it("POST:201 - Posts a comment to the supplied article_id and returns the posted comment", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "Ben", body: "THIS IS A TEST COMMENT" })
                .expect(201)
                .then(({ body }) => {
                  console.log("INSIDE POST TEST BODY ->", body);
                  expect(body).to.be.an("object");
                  expect(treasure).to.have.keys(["username", "body"]);
                });
            });
            describe("POST ERRORS", () => {
              //More work required on these POST errors
              it("ERROR: 400 - Bad article_id", () => {
                return request(app)
                  .post("/api/articles/abc/comments")
                  .send({ username: "Ben", body: "test comment" })
                  .expect(400)
                  .then(output => {
                    console.log("INSIDE POST response", output);
                  });
              });
              it("ERROR: 404 - article_id not found", () => {});
              it("ERROR: 404 - username not found", () => {});
              it("ERROR: 400 - No comment inside body", () => {});
            });
          });
        });
        describe("GET", () => {
          it("GET:200 - returns an object", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: article }) => {
                expect(article).to.be.an("object");
              });
          });
          it("GET:200 - returns an object with the expected keys", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: article }) => {
                expect(article).to.contain.keys(
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
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
                  expect(body.msg.split("-")[1]).to.equal(
                    ' invalid input syntax for type integer: "abc"'
                  );
                });
            });
          });
        });
        describe("PATCH", () => {
          it("PATCH:201 - Increase vote value by 1 for the specified article_id and return the updated article as an object", () => {
            return request(app)
              .patch("/api/articles/6")
              .send({ inc_votes: 1 })
              .expect(201)
              .then(({ body: { articleObj } }) => {
                expect(articleObj).to.be.an("object");
                expect(articleObj).to.have.keys([
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                ]);
                expect(articleObj.votes).to.equal(1);
              });
          });
          it("PATCH:201 - Decrease vote value by 10 for the specified article_id and return the updated article as an object", () => {
            return request(app)
              .patch("/api/articles/6")
              .send({ inc_votes: -10 })
              .expect(201)
              .then(({ body: { articleObj } }) => {
                expect(articleObj).to.be.an("object");
                expect(articleObj).to.have.keys([
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                ]);
                expect(articleObj.votes).to.equal(-10);
              });
          });
          describe("PATCH ERRORS", () => {
            it("ERROR: 400 - No inc_votes on request body", () => {
              return request(app)
                .patch("/api/articles/6")
                .send({})
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("No inc_votes on request body");
                });
            });
            it("ERROR: 400 - Invalid inc_votes value", () => {
              return request(app)
                .patch("/api/articles/6")
                .send({ inc_votes: "abc" })
                .expect(400)
                .then(({ body }) => {
                  const errMsg = body.msg.split("-")[1];
                  expect(errMsg).to.equal(
                    ' invalid input syntax for type integer: "NaN"'
                  );
                });
            });
            it("ERROR: 400 - Other property on the request body", () => {
              return request(app)
                .patch("/api/articles/6")
                .send({ inc_votes: "1", name: "mitch" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    "Other property on the request body"
                  );
                });
            });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("PATCH", () => {
          it("PATCH:201 - Returns comment object with a correctly updated votes value", () => {
            return request(app)
              .patch("/api/comments/2")
              .send({ inc_votes: 1 })
              .expect(201)
              .then(({ body }) => {
                console.log(body);
              });
          });
          it("PATCH:201 - Returns comment object with a correctly decremented votes value", () => {
            //CONTINUE FROM HERE
          });
          describe("PATCH ERRORS", () => {
            it("ERROR 404 - comment_id not found", () => {});
            it("ERROR 400 - Bad comment_id", () => {});
            it("ERROR 400 - inc_votes is an invalid value", () => {});
            it("ERROR 400 - inc_votes is not in the body", () => {});
          });
        });
        describe("DELETE", () => {
          it("DELETE:204 - Successfully removes the comment from the database", () => {
            return request(app)
              .delete("/api/comments/2")
              .expect(204)
              .then(comment => {
                console.log("Inside then block, comment ->", comment.body);
              });
          });
          describe("DELETE ERRORS", () => {
            it("ERROR 404 - comment_id not found", () => {});
            it("ERROR 400 - Bad comment_id", () => {});
          });
        });
      });
    });
  });
});
