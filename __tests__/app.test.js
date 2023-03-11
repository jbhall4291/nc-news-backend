const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index.js");
const jestSorted = require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("app.js", () => {
  describe("GET requests on /api/topics", () => {
    test("Status 200: responds with an object 'allTopics' with a value of an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("allTopics");
          expect(Array.isArray(response.body.allTopics)).toBe(true);
        });
    });

    test("Status 200: returns an array with the same length as the original test data", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.allTopics).toHaveLength(
            testData.topicData.length
          );
        });
    });

    test("Status 200: first item in array has the properties 'slug' and 'description'", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.allTopics[0]).toHaveProperty("slug");
          expect(response.body.allTopics[0]).toHaveProperty("description");
        });
    });

    test("Status 200: all items in array have the properties 'slug' and 'description'", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          response.body.allTopics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });

    test("Status 200: returns first item in array with the same values as the original test data", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.allTopics[0].slug).toEqual("mitch");
          expect(response.body.allTopics[0].description).toEqual(
            "The man, the Mitch, the legend"
          );
        });
    });

    test("Status 404: returns an error if path doesn't exist", () => {
      return request(app)
        .get("/api/topicsbanana")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("invalid endpoint");
        });
    });
  });

  describe("GET requests on /api/articles", () => {
    test("Status 200: responds with an object 'articles' with a value of an array", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("articles");
          expect(Array.isArray(response.body.articles)).toBe(true);
        });
    });

    test("Status 200: returns an array with the same length as the original test data", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toHaveLength(
            testData.articleData.length
          );
        });
    });

    test("Status 200: first item in array has expected properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles[0]).toHaveProperty("author");
          expect(response.body.articles[0]).toHaveProperty("title");
          expect(response.body.articles[0]).toHaveProperty("article_id");
          expect(response.body.articles[0]).toHaveProperty("topic");
          expect(response.body.articles[0]).toHaveProperty("created_at");
          expect(response.body.articles[0]).toHaveProperty("votes");
          expect(response.body.articles[0]).toHaveProperty("article_img_url");
        });
    });

    test("Status 200: all items in array have expected properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          response.body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("article_img_url");
            expect(article).not.toHaveProperty("body");
          });
        });
    });

    test("Status 200: all items in array have a comment_count property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          response.body.articles.forEach((article) => {
            expect(article).toHaveProperty("comment_count");
          });
        });
    });

    test("Status 200: articles array should be sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });

  describe("GET requests on /api/articles/:article_id", () => {
    test("Status 200: returns a single article object on a key of 'article'", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(typeof response.body.article).toBe("object");
          expect(Array.isArray(response.body.article)).toBe(false);
          expect(Object.keys(response.body).length).toBe(1);
        });
    });

    test("Status 200: returns a single article object with expected properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });

    test("Status 200: returns article_id 1 with expected values", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.article_id).toBe(1);
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(100);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });

    test("Status 200: returns article_id 3 with expected values", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.author).toBe("icellusedkars");
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.article_id).toBe(3);
          expect(article.body).toBe("some gifs");
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(article.votes).toBe(0);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });

    test("Status 200: returns article 1 with a comment_count property with a value of 11, a total of all comments for article 1", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.comment_count).toBe("11");
        });
    });

    test("Status 200: returns article 3 with a comment_count property with a value of 2, a total of all comments for article 3", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.comment_count).toBe("2");
        });
    });

    test("Status 400: returns a message with a value of 'article_id is not a number' if article_id is not a number", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("article_id is not a number");
        });
    });

    test("Status 404: returns a message 'article_id not found' if article_id doesn't exist", () => {
      return request(app)
        .get("/api/articles/10000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article_id not found");
        });
    });
  });

  describe("GET requests on /api/articles/:article_id/comments", () => {
    test("Status 200: returns back an object with a property of comments which is an array", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("comments");
          expect(Array.isArray(response.body.comments)).toBe(true);
        });
    });

    test("Status 200: each comment has expected properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          response.body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
          });
        });
    });

    test("Status 200: comments property has the correct number of comments for article_id 1", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(11);
        });
    });

    test("Status 200: comments property has the correct number of comments for article_id 3", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(2);
        });
    });

    test("Status 200: comments array should be sorted by date in descending order i.e. most recent first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("Status 404: returns a message 'article_id not found' if article_id doesn't exist", () => {
      return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article_id not found");
        });
    });

    test("Status 404: returns a message with 'specified article_id has no comments' for article_id 2", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "specified article_id has no comments"
          );
        });
    });
  });

  describe("POST requests on /api/articles/:article_id/comments", () => {
    test("Status 201: returns the inserted comment", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          username: "icellusedkars",
          body: "A-ha! Guess who's back in the big-time?",
        })
        .expect(201)
        .then((response) => {
          expect(response.body.commentInserted.comment_id).toBe(19);
          expect(response.body.commentInserted.body).toBe(
            "A-ha! Guess who's back in the big-time?"
          );
          expect(response.body.commentInserted.article_id).toBe(3);
          expect(response.body.commentInserted.author).toBe("icellusedkars");
          expect(response.body.commentInserted.votes).toBe(0);
          expect(response.body.commentInserted).toHaveProperty("created_at");
        });
    });

    test("Status 404: returns an error if post request made to a non-existent article_id", () => {
      return request(app)
        .post("/api/articles/999999/comments")
        .send({
          username: "icellusedkars",
          body: "A-ha! Guess who's back in the big-time?",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article_id not found");
        });
    });

    test("Status 400: returns an error if post request made to an article_id which is not a number", () => {
      return request(app)
        .post("/api/articles/banana/comments")
        .send({
          username: "icellusedkars",
          body: "A-ha! Guess who's back in the big-time?",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("article_id is not a number");
        });
    });

    test("Status 400: returns an error if post request is missing username", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ body: "A-ha! Guess who's back in the bigtime?" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("comment is missing username");
        });
    });

    test("Status 400: returns an error if post request is missing body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "icellusedkars" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("comment is missing body");
        });
    });

    test("Status 400: returns an error if post request is sent with a username not in the 'users' table", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "A. Partridge",
          body: "A-ha! Guess who's back in the bigtime?",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("username does not exist");
        });
    });
  });

  describe("PATCH requests on /api/articles/:article_id", () => {
    test("Status 202: returns article_id=1 with votes value increased by 1 to a value of 101", () => {
      const expectedResponse = {
        updatedArticle: {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      };

      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: 1,
        })
        .expect(202)
        .then((response) => {
          expect(response.body).toEqual(expectedResponse);
        });
    });

    test("Status 202: returns article_id=1 with votes value decreased by 10 to a value of 90", () => {
      const expectedResponse = {
        updatedArticle: {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      };

      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: -10,
        })
        .expect(202)
        .then((response) => {
          expect(response.body).toEqual(expectedResponse);
        });
    });

    test("Status 202: returns article_id=3 with votes value increased by 7 to a value of 7", () => {
      const expectedResponse = {
        updatedArticle: {
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 7,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      };

      return request(app)
        .patch("/api/articles/3")
        .send({
          inc_votes: 7,
        })
        .expect(202)
        .then((response) => {
          expect(response.body).toEqual(expectedResponse);
        });
    });

    test("Status 400: returns message 'inc_votes value must be a number'", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: "banana",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("inc_votes value must be a number");
        });
    });

    test("Status 404: returns message 'article_id not found'", () => {
      return request(app)
        .patch("/api/articles/1000000")
        .send({
          inc_votes: 1,
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article_id not found");
        });
    });

    test("Status 400: returns message 'article_id is not a number'", () => {
      return request(app)
        .patch("/api/articles/banana")
        .send({
          inc_votes: 1,
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("article_id is not a number");
        });
    });

    test("Status 400: returns message 'inc_votes property missing'", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_bananas: 1,
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("inc_votes property missing");
        });
    });
  });

  describe("GET requests on /api/users", () => {
    test("Status 200: responds with an object 'allUsers' which is an array of 4 user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.allUsers)).toBe(true);
          expect(response.body.allUsers).toHaveLength(4);
        });
    });

    test("Status 200: each user object in allUsers has expected properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          response.body.allUsers.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });

  describe("GET requests with queries on /api/articles", () => {
    test("Status 200: return the single article that has the topic 'cats'", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toHaveLength(1);
          expect(response.body.articles[0].author).toBe("rogersop");
          expect(response.body.articles[0].title).toBe(
            "UNCOVERED: catspiracy to bring down democracy"
          );
          expect(response.body.articles[0].article_id).toBe(5);
          expect(response.body.articles[0].topic).toBe("cats");
          expect(response.body.articles[0].created_at).toBe(
            "2020-08-03T13:14:00.000Z"
          );
          expect(response.body.articles[0].votes).toBe(0);
          expect(response.body.articles[0].article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(response.body.articles[0].comment_count).toBe("2");
        });
    });

    test("Status 200: returns all 11 articles with the topic 'mitch', sorted by descending date by default", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toHaveLength(11);
          expect(response.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("Status 200: returns articles with the topic 'mitch', specifically sorted by descending date", () => {
      return request(app)
        .get("/api/articles?topic=mitch&order=desc")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("Status 200: returns articles with the topic 'mitch', specifically sorted by ascending date", () => {
      return request(app)
        .get("/api/articles?topic=mitch&order=asc")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });

    test("Status 400: responds with message 'invalid order query'", () => {
      return request(app)
        .get("/api/articles?topic=mitch&order=bananas")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("invalid order query");
        });
    });

    test("Status 400: responds with message 'invalid sort query'", () => {
      return request(app)
        .get("/api/articles?topic=mitch&order=asc&sort_by=bananas")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("invalid sort query");
        });
    });

    test("Status 404: returns message 'no articles found' if non-existent topic queried", () => {
      return request(app)
        .get("/api/articles?topic=bananas")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("no articles found");
        });
    });
  });

  describe("DELETE requests on /api/comments/:comment_id", () => {
    test("Status 204: responds with no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          expect(response.body.msg).toBe(undefined);
        });
    });

    test("Status 204: comment_id 1 is deleted from database", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db
            .query("SELECT * FROM comments WHERE comment_id = 1")
            .then(({ rowCount }) => {
              expect(rowCount).toBe(0);
            });
        });
    });

    test("Status 404: responds with message 'comment_id not found'", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("comment_id not found");
        });
    });

    test("Status 400: responds with message 'comment_id is not a number'", () => {
      return request(app)
        .delete("/api/comments/bananas")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("comment_id is not a number");
        });
    });
  });

  describe("GET requests on /api", () => {
    test("Status 200: responds with a JSON describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const endpoints = response.body.endpoints;
          
          expect(endpoints).toHaveProperty("GET /api");
          expect(endpoints).toHaveProperty("GET /api/topics");
          expect(endpoints).toHaveProperty("GET /api/articles");
          expect(endpoints).toHaveProperty("GET /api/articles/:article_id");
          expect(endpoints).toHaveProperty("PATCH /api/articles/:article_id");
          expect(endpoints).toHaveProperty(
            "GET /api/articles/:article_id/comments"
          );
          expect(endpoints).toHaveProperty(
            "POST /api/articles/:article_id/comments"
          );
          expect(endpoints).toHaveProperty("GET /api/users");
          expect(endpoints).toHaveProperty("DELETE /api/comments/:comment_id");
        });
    });
    test("Status 200: each endpoint has 'description', 'queries' & 'exampleResponse' properties", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const endpoints = response.body.endpoints;
          console.log(endpoints)
          for (const key in endpoints) {
            expect(endpoints[key]).toHaveProperty("description");
            expect(endpoints[key]).toHaveProperty("exampleResponse");
            expect(endpoints[key]).toHaveProperty("queries");  
          }

        });
    });
  });
});
