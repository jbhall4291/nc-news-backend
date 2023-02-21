const express = require("express");
const app = express();
const {getAllTopics} = require('./controllers/topicControllers.js')
const {getAllArticles} = require('./controllers/articleControllers.js')

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.use((request, response, next) => {
    response.status(404).send({msg: "Invalid Endpoint"})
})

module.exports = app;