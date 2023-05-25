const { selectAllTopics, insertTopic } = require("../models/topicModels.js");

exports.getAllTopics = (request, response, next) => {
  selectAllTopics()
    .then((results) => {
      response.status(200).send({ allTopics: results.rows });
    })
    .catch(next);
};

exports.postTopic = (request, response, next) => {
  const topicData = request.body;
  insertTopic(topicData)
    .then((result) => {
      response.status(201).send({ topicInserted: result });
    })
    .catch(next);
};
