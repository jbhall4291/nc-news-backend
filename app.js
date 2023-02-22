const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topicControllers.js");
const {
  getAllArticles,
  getArticle,
  getArticleComments,
} = require("./controllers/articleControllers.js");
const {
  handle400Statuses,
  handle500Statuses,
} = require("./controllers/errorHandlingControllers.js");

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.use(handle400Statuses);

app.use(handle500Statuses);

app.use((request, response, next) => {
  response.status(404).send({ msg: "invalid endpoint" });
});

module.exports = app;
