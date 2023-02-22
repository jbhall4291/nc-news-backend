const {
  selectAllArticles,
  selectArticleById,
} = require("../models/articlesModels.js");

exports.getAllArticles = (request, response, next) => {
  selectAllArticles().then((results) => {
    response.status(200).send({ allArticles: results.rows });
  });
};

exports.getArticle = (request, response, next) => {
  const { article_id } = request.params;

  selectArticleById(article_id)
    .then((result) => {
      response.status(200).send({ article: result });
    })
    .catch(next);
};
