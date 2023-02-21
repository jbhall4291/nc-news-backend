const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index.js");


beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

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
      expect(response.body.allTopics).toHaveLength(testData.topicData.length);
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
      expect(response.body.msg).toBe("Invalid Endpoint");
    });
});
