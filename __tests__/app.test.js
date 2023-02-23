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
    test("Status 200: responds with an object 'allArticles' with a value of an array", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("allArticles");
          expect(Array.isArray(response.body.allArticles)).toBe(true);
        });
    });

    test("Status 200: returns an array with the same length as the original test data", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.allArticles).toHaveLength(
            testData.articleData.length
          );
        });
    });

    test("Status 200: first item in array has expected properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.allArticles[0]).toHaveProperty("author");
          expect(response.body.allArticles[0]).toHaveProperty("title");
          expect(response.body.allArticles[0]).toHaveProperty("article_id");
          expect(response.body.allArticles[0]).toHaveProperty("topic");
          expect(response.body.allArticles[0]).toHaveProperty("created_at");
          expect(response.body.allArticles[0]).toHaveProperty("votes");
          expect(response.body.allArticles[0]).toHaveProperty(
            "article_img_url"
          );
        });
    });

    test("Status 200: all items in array have expected properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          response.body.allArticles.forEach((article) => {
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
          response.body.allArticles.forEach((article) => {
            expect(article).toHaveProperty("comment_count");
          });
        });
    });

    test("Status 200: articles array should be sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.allArticles).toBeSortedBy("created_at", {
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
        .send({ username: "A. Partridge",  body: "A-ha! Guess who's back in the bigtime?"  })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("username does not exist");
        });
    });
  });
});
