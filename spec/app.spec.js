process.env.NODE_ENV = "test"
const { expect } = require("chai")
const request = require("supertest")
const app = require("../app.js")
const connection = require("../dbconnection.js")
const chai = require("chai")
chai.use(require("chai-sorted"))

describe("app", () => {
  after(() => {
    return connection.destroy()
  })
  beforeEach(() => {
    return connection.seed.run()
  })
  describe("NOT A ROUTE", () => {
    it("ERROR: 404 - Route not found", (done) => {
      return request(app)
        .get("/api/notaroute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found")
          done()
        })
    })
  })
  describe("/api", () => {
    describe("GET", () => {
      it("GET:200 - returns an object", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an("object")
          })
      })
      it("GET:200 - the returned object contains all of the expected endpoints", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.have.keys([
              "GET /api/topics",
              "GET /api/users/:username",
              "GET /api/articles/:article_id",
              "PATCH /api/articles/:article_id",
              "POST /api/articles/:article_id/comments",
              "GET /api/articles/:article_id/comments",
              "GET /api/articles",
              "PATCH /api/comments/:comment_id",
              "DELETE /api/comments/:comment_id",
              "GET /api",
            ])
          })
      })
    })
    describe("Invalid HTTP methods", () => {
      it("HTTP status code:405 - Method Not Allowed", () => {
        const invalidMethods = ["post", "patch", "put", "delete"]
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed")
            })
        })
        return Promise.all(methodPromises)
      })
    })
    describe("/topics", () => {
      describe("GET", () => {
        it("GET:200 - returns an object with a key value of topics", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.an("object")
              expect(body).to.have.keys("topics")
            })
        })
        it("GET:200 - the topics key has an array of objects, each containing the expected keys", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).to.be.an("array")
              body.topics.forEach((topic) => {
                expect(topic).to.have.keys(["slug", "description"])
              })
            })
        })
      })
      describe("Invalid HTTP methods", () => {
        it("HTTP status code:405 - Method Not Allowed", () => {
          const invalidMethods = ["post", "patch", "put", "delete"]
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed")
              })
          })
          return Promise.all(methodPromises)
        })
      })
    })
    describe("/users", () => {
      describe("/:username", () => {
        describe("GET", () => {
          it("GET:200 - returns an object", () => {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("object")
                expect(body).to.have.keys(["user"])
              })
          })
          it("GET:200 - the user key has an object containing the expected keys", () => {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("object")
                expect(body.user).to.have.keys([
                  "username",
                  "avatar_url",
                  "name",
                ])
              })
          })
          describe("GET ERRORS", () => {
            it("ERROR: 404 - username not found", () => {
              return request(app)
                .get("/api/users/userthatdoesnotexist")
                .expect(404)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body).to.have.keys(["msg"])
                  expect(body.msg).to.equal("username not found")
                })
            })
          })
        })
        describe("Invalid HTTP methods", () => {
          it("HTTP status code:405 - Method Not Allowed", () => {
            const invalidMethods = ["post", "patch", "put", "delete"]
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/users/butter_bridge")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed")
                })
            })
            return Promise.all(methodPromises)
          })
        })
      })
    })
    describe("/articles", () => {
      describe("/", () => {
        describe("GET", () => {
          it("GET:200 - returns an object with a key value of articles", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("object")
                expect(body).to.have.keys("articles")
              })
          })
          it("GET:200 - each object in the articles array have the expected keys", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body }) => {
                body.articles.forEach((article) => {
                  expect(article).to.have.keys([
                    "article_id",
                    "title",
                    "body",
                    "votes",
                    "topic",
                    "author",
                    "created_at",
                    "comment_count",
                  ])
                })
              })
          })
          it("GET:200 - array of article objects has default sorting (created_at, desc) when no parameters are passed", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.sortedBy("created_at", {
                  descending: true,
                })
              })
          })
          it("GET:200 - array of article objects is sorted by the passed column with the default sort order (descending)", () => {
            return request(app)
              .get("/api/articles?sort_by=votes")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.sortedBy("votes", {
                  descending: true,
                })
              })
          })
          it("GET:200 - array of article objects is sorted by the default column (created_at) and the order is set by the passed order", () => {
            return request(app)
              .get("/api/articles?order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles).to.be.sortedBy("created_at", {
                  ascending: true,
                })
              })
          })
          it("GET:200 - returns an array of article objects which contain the passed author", () => {
            return request(app)
              .get("/api/articles?author=butter_bridge")
              .expect(200)
              .then(({ body }) => {
                body.articles.forEach((article) => {
                  expect(article.author).to.equal("butter_bridge")
                })
              })
          })
          it("GET:200 - returns an array of article objects which contain the passed topic", () => {
            return request(app)
              .get("/api/articles?topic=mitch")
              .expect(200)
              .then(({ body }) => {
                body.articles.forEach((article) => {
                  expect(article.topic).to.equal("mitch")
                })
              })
          })
          describe("GET ERRORS", () => {
            it("ERROR: 400 - sort_by value is not a valid column", () => {
              return request(app)
                .get("/api/articles?sort_by=notValidColumn")
                .expect(400)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body).to.have.keys(["msg"])
                  expect(body.msg).to.equal(
                    ' column "notValidColumn" does not exist'
                  )
                })
            })
            it("ERROR: 400 - order value is not 'asc' or 'desc'", () => {
              return request(app)
                .get("/api/articles?order=notAnOrder")
                .expect(400)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body).to.have.keys(["msg"])
                  expect(body.msg).to.equal("Invalid order value")
                })
            })
            it("ERROR: 404 - author does not exist in the users table", () => {
              return request(app)
                .get("/api/articles?author=notAnAuthor")
                .expect(404)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body).to.have.keys(["msg"])
                  expect(body.msg).to.equal(
                    "Author not found in the users table"
                  )
                })
            })
            it("ERROR: 404 - topic value does not exist in the topics table", () => {
              return request(app)
                .get("/api/articles?topic=notATopic")
                .expect(404)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body).to.have.keys(["msg"])
                  expect(body.msg).to.equal(
                    "Topic not found in the topics table"
                  )
                })
            })
            it("ERROR: 200 - author exists but no articles are linked to this author", () => {
              return request(app)
                .get("/api/articles?author=lurker")
                .expect(200)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body).to.have.keys(["articles"])
                  expect(body.articles).to.eql([])
                })
            })
            it("ERROR: 200 - topic exists but no articles are linked to this topic", () => {
              return request(app)
                .get("/api/articles?topic=paper")
                .expect(200)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body).to.have.keys(["articles"])
                  expect(body.articles).to.eql([])
                })
            })
          })
        })
        describe("Invalid HTTP methods", () => {
          it("HTTP status code:405 - Method Not Allowed", () => {
            const invalidMethods = ["post", "patch", "put", "delete"]
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/articles")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed")
                })
            })
            return Promise.all(methodPromises)
          })
        })
      })
      describe("/:article_id", () => {
        describe("/comments", () => {
          describe("GET", () => {
            it("GET:200 - returns an empty object when the article_id is valid but no comments exist", () => {
              return request(app)
                .get("/api/articles/2/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body.comments).to.be.eql([])
                })
            })
            it("GET:200 - returns a JSON object of comments with default sorting", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body.comments).to.be.an("array")
                  expect(body.comments.length).to.equal(13)
                  body.comments.forEach((comment) => {
                    expect(comment).to.have.keys([
                      "comment_id",
                      "author",
                      "article_id",
                      "votes",
                      "created_at",
                      "body",
                    ])
                  })
                  expect(body.comments).to.be.sortedBy("created_at", {
                    descending: true,
                  })
                })
            })
            it("GET:200 - returns a JSON object of comments sorted by votes in descending order", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes&order=desc")
                .expect(200)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body.comments.length).to.equal(13)
                  body.comments.forEach((comment) => {
                    expect(comment).to.have.keys([
                      "comment_id",
                      "author",
                      "article_id",
                      "votes",
                      "created_at",
                      "body",
                    ])
                  })
                  expect(body.comments).to.be.sortedBy("votes", {
                    descending: true,
                  })
                })
            })
            describe("GET ERRORS", () => {
              it("ERROR: 400 - Bad article_id", () => {
                return request(app)
                  .get("/api/articles/abc/comments")
                  .expect(400)
                  .then(({ body }) => {
                    expect(body).to.be.an("object")
                    expect(body).to.have.keys(["msg"])
                    expect(body.msg).to.equal(
                      ' invalid input syntax for type integer: "abc"'
                    )
                  })
              })
              it("ERROR: 404 - article_id not found", () => {
                return request(app)
                  .get("/api/articles/9999/comments")
                  .expect(404)
                  .then(({ body }) => {
                    expect(body).to.be.an("object")
                    expect(body).to.have.keys(["msg"])
                    expect(body.msg).to.equal("article_id not found")
                  })
              })
            })
          })
          describe("POST", () => {
            it("POST:201 - Posts a comment to the supplied article_id and returns the posted comment", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ username: "rogersop", body: "THIS IS A TEST COMMENT" })
                .expect(201)
                .then(({ body }) => {
                  expect(body).to.be.an("object")
                  expect(body.comment).to.have.keys([
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body",
                  ])
                })
            })
            describe("POST ERRORS", () => {
              it("ERROR: 400 - Bad article_id", () => {
                return request(app)
                  .post("/api/articles/abc/comments")
                  .send({ username: "butter_bridge", body: "Test comment" })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body).to.be.an("object")
                    expect(body).to.have.keys(["msg"])
                    expect(body.msg).to.equal(
                      ' invalid input syntax for type integer: "abc"'
                    )
                  })
              })
              it("ERROR: 404 - article_id not found", () => {
                return request(app)
                  .post("/api/articles/9999/comments")
                  .send({ username: "butter_bridge", body: "Test comment" })
                  .expect(404)
                  .then(({ body }) => {
                    expect(body).to.be.an("object")
                    expect(body).to.have.keys(["msg"])
                    expect(body.msg).to.equal("article_id not found")
                  })
              })
              it("ERROR: 404 - username not found", () => {
                return request(app)
                  .post("/api/articles/1/comments")
                  .send({ username: "Ben", body: "Test comment" })
                  .expect(404)
                  .then(({ body }) => {
                    expect(body).to.be.an("object")
                    expect(body).to.have.keys(["msg"])
                    expect(body.msg).to.equal("username not found")
                  })
              })
              it("ERROR: 400 - No comment inside body", () => {
                return request(app)
                  .post("/api/articles/1/comments")
                  .send({ username: "Ben", body: "" })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body).to.be.an("object")
                    expect(body).to.have.keys(["msg"])
                    expect(body.msg).to.equal(
                      "No comment body inside the send body"
                    )
                  })
              })
              it("ERROR: 400 - Request does not include username in the request body", () => {
                return request(app)
                  .post("/api/articles/1/comments")
                  .send({ body: "Test comment" })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body).to.be.an("object")
                    expect(body).to.have.keys(["msg"])
                    expect(body.msg).to.equal(
                      "username not in the request body"
                    )
                  })
              })
              it("ERROR: 400 - Request does not include body in the request body", () => {
                return request(app)
                  .post("/api/articles/1/comments")
                  .send({ username: "Ben" })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body).to.be.an("object")
                    expect(body).to.have.keys(["msg"])
                    expect(body.msg).to.equal(
                      "comment body not in the request body"
                    )
                  })
              })
            })
          })
          describe("Invalid HTTP methods", () => {
            it("HTTP status code:405 - Method Not Allowed", () => {
              const invalidMethods = ["patch", "put", "delete"]
              const methodPromises = invalidMethods.map((method) => {
                return request(app)
                  [method]("/api/articles/1/comments")
                  .expect(405)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("method not allowed")
                  })
              })
              return Promise.all(methodPromises)
            })
          })
        })
        describe("GET", () => {
          it("GET:200 - returns an object", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("object")
              })
          })
          it("GET:200 - returns an object with the expected keys", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.contain.keys(
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                )
              })
          })
          describe("GET ERRORS", () => {
            it("ERROR: 404 - article_id not found", () => {
              return request(app)
                .get("/api/articles/999")
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("article_id not found")
                })
            })
            it("ERROR: 400 - bad article_id", () => {
              return request(app)
                .get("/api/articles/abc")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    ' invalid input syntax for type integer: "abc"'
                  )
                })
            })
          })
        })
        describe("PATCH", () => {
          it("PATCH:200 - Increase vote value by 1 for the specified article_id and return the updated article as an object", () => {
            return request(app)
              .patch("/api/articles/6")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("object")
                expect(body.article).to.have.keys([
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at",
                ])
                expect(body.article.votes).to.equal(1)
              })
          })
          it("PATCH:200 - Decrease vote value by 10 for the specified article_id and return the updated article as an object", () => {
            return request(app)
              .patch("/api/articles/6")
              .send({ inc_votes: -10 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("object")
                expect(body.article).to.have.keys([
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at",
                ])
                expect(body.article.votes).to.equal(-10)
              })
          })
          describe("PATCH ERRORS", () => {
            it("ERROR: 400 - No inc_votes on request body", () => {
              return request(app)
                .patch("/api/articles/6")
                .send({})
                .expect(200)
                .then(({ body }) => {
                  expect(body.article.votes).to.equal(0)
                })
            })
            it("ERROR: 400 - Invalid inc_votes value", () => {
              return request(app)
                .patch("/api/articles/6")
                .send({ inc_votes: "abc" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    ' invalid input syntax for type integer: "NaN"'
                  )
                })
            })
            it("ERROR: 400 - Other property on the request body", () => {
              return request(app)
                .patch("/api/articles/6")
                .send({ inc_votes: "1", name: "mitch" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    "Other property on the request body"
                  )
                })
            })
          })
        })
        describe("Invalid HTTP methods", () => {
          it("HTTP status code:405 - Method Not Allowed", () => {
            const invalidMethods = ["post", "put", "delete"]
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/articles/1")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed")
                })
            })
            return Promise.all(methodPromises)
          })
        })
      })
    })
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("PATCH", () => {
          it("PATCH:200 - Returns comment object with a correctly updated votes value", () => {
            return request(app)
              .patch("/api/comments/6")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("object")
                expect(body.comment).to.have.keys([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body",
                ])
                expect(body.comment.votes).to.equal(1)
              })
          })
          it("PATCH:200 - Returns comment object with a correctly decremented votes value", () => {
            return request(app)
              .patch("/api/comments/6")
              .send({ inc_votes: -10 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.be.an("object")
                expect(body.comment).to.have.keys([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body",
                ])
                expect(body.comment.votes).to.equal(-10)
              })
          })
          it("PATCH:200 - Returns an unchanged comment object when no inc_votes is provided in the request body", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ not_votes: "abc" })
              .expect(200)
              .then(({ body }) => {
                expect(body.comment).to.eql({
                  comment_id: 1,
                  author: "butter_bridge",
                  article_id: 9,
                  votes: 16,
                  created_at: "2017-11-22T12:36:03.389Z",
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                })
                expect(body.comment).to.have.keys([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body",
                ])
              })
          })
          describe("PATCH ERRORS", () => {
            it("ERROR 404 - comment_id not found", () => {
              return request(app)
                .patch("/api/comments/99")
                .send({ inc_votes: 1 })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("comment_id not found")
                })
            })
            it("ERROR 400 - Bad comment_id", () => {
              return request(app)
                .patch("/api/comments/abc")
                .send({ inc_votes: 1 })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    ' invalid input syntax for type integer: "abc"'
                  )
                })
            })
            it("ERROR 400 - inc_votes is an invalid value", () => {
              return request(app)
                .patch("/api/comments/1")
                .send({ inc_votes: "abc" })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    ' invalid input syntax for type integer: "NaN"'
                  )
                })
            })
          })
        })
        describe("DELETE", () => {
          it("DELETE:204 - Successfully removes the comment from the database", () => {
            return request(app)
              .delete("/api/comments/2")
              .expect(204)
              .then((comment) => {
                expect(comment.body).to.eql({})
              })
          })
          describe("DELETE ERRORS", () => {
            it("ERROR 404 - comment_id not found", () => {
              return request(app)
                .delete("/api/comments/99")
                .expect(404)
                .then((comment) => {
                  expect(comment.body).to.eql({ msg: "comment_id not found" })
                })
            })
            it("ERROR 400 - Bad comment_id", () => {
              return request(app)
                .delete("/api/comments/abc")
                .expect(400)
                .then((comment) => {
                  expect(comment.body).to.eql({
                    msg: ' invalid input syntax for type integer: "abc"',
                  })
                })
            })
          })
        })
        describe("Invalid HTTP methods", () => {
          it("HTTP status code:405 - Method Not Allowed", () => {
            const invalidMethods = ["get", "post", "put"]
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/comments/1")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed")
                })
            })
            return Promise.all(methodPromises)
          })
        })
      })
    })
  })
})
