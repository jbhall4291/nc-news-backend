const cors = require('cors');
const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topicControllers.js");
const {
  getArticles,
  getArticle,
  patchArticle,
} = require("./controllers/articleControllers.js");
const {
  getArticleComments,
  postArticleComment,
  deleteComment,
} = require("./controllers/commentControllers");
const { getUsers } = require("./controllers/userControllers.js");
const {
  handle400Statuses,
  handle500Statuses,
} = require("./controllers/errorHandlingControllers.js");
const {getEndpoints} = require('./controllers/endpointControllers.js')

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints)

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComment);

app.use((request, response, next) => {
  response.status(404).send({ msg: "invalid endpoint" });
});

app.use(handle400Statuses);

app.use(handle500Statuses);

module.exports = app;
