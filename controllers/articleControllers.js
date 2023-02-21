const { selectAllArticles } = require("../models/articlesModels.js");

exports.getAllArticles = (request, response, next) => {
  selectAllArticles().then((results) => {
    response.status(200).send({ allArticles: results.rows });
  });
};
