const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topicControllers.js");
const {
  getAllArticles,
  getArticle,
  patchArticle,
} = require("./controllers/articleControllers.js");
const {
  getArticleComments,
  postArticleComment,
} = require("./controllers/commentControllers");
const {getUsers} = require("./controllers/userControllers.js")
const {
  handle400Statuses,
  handle500Statuses,
} = require("./controllers/errorHandlingControllers.js");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.get("/api/users", getUsers)

app.use((request, response, next) => {
  response.status(404).send({ msg: "invalid endpoint" });
});

app.use(handle400Statuses);

app.use(handle500Statuses);

module.exports = app;
