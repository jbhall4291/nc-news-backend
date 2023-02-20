const { selectAllTopics } = require("../models/topicModels.js");

exports.getAllTopics = (request, response, next) => {
  selectAllTopics().then((results) => {
    response.status(200).send({ allTopics: results.rows })
    
  });
};
