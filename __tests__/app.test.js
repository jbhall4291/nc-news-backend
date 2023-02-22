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

  describe("/api/articles/:article_id", () => {
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
  });
});

describe("app.js error handling", () => {
  test("Status 404: returns an error if path doesn't exist", () => {
    return request(app)
      .get("/api/topicsbanana")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid endpoint");
      });
  });

  test("Status 400: returns a message with a value of 'bad request: article_id is not a number' if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request: article_id is not a number");
      });
  });

  test("Status 404: returns a message with a value of 'article_id not found' if article_id doesn't exist", () => {
    return request(app)
      .get("/api/articles/10000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article_id not found");
      });
  });
});
