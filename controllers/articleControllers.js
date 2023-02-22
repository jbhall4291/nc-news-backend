const {
  selectAllArticles,
  selectArticleById,
} = require("../models/articlesModels.js");
const { selectArticleComments } = require("../models/commentsModels.js");

exports.getAllArticles = (request, response, next) => {
  selectAllArticles()
    .then((results) => {
      response.status(200).send({ allArticles: results.rows });
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

exports.getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleComments(article_id)
    .then((results) => {
      response.status(200).send({ comments: results });
    })
    .catch(next);
};
