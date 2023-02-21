const express = require("express");
const app = express();
const {getAllTopics} = require('./controllers/topicControllers.js')

app.get("/api/topics", getAllTopics);

app.use((request, response, next) => {
    response.status(404).send({msg: "Invalid Endpoint"})
})

module.exports = app;