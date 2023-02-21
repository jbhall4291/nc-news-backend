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
  describe("/api/topics", () => {
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
  });

  describe("/api/articles", () => {
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

  describe("app.js error handling", () => {
    test("Status 404: returns an error if path doesn't exist", () => {
      return request(app)
        .get("/api/topicsbanana")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid Endpoint");
        });
    });
  });
});
