const {
  selectArticles,
  selectArticleById,
  updateArticle,
} = require("../models/articlesModels.js");

exports.getArticles = (request, response, next) => {
  const articleQuery = request.query;

  

  selectArticles(articleQuery)
    .then((results) => {
      response.status(200).send({ articles: results.rows });
    })
    .catch(next);
};

exports.getArticle = (request, response, next) => {
  const { article_id } = request.params;

  selectArticleById(article_id)
    .then((result) => {
      response.status(200).send({ article: result });
    })
    .catch(next);
};

exports.patchArticle = (request, response, next) => {
  const { article_id } = request.params;
  const patchData = request.body;

  Promise.all([
    selectArticleById(article_id),
    updateArticle(article_id, patchData),
  ])
    .then(([promise1Result, promise2Result]) => {
      response.status(202).send({ updatedArticle: promise2Result });
    })
    .catch(next);
};
