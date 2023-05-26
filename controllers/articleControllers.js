const {
  selectArticles,
  selectArticleById,
  updateArticle,
  insertArticle,
  deleteArticleById,
} = require("../models/articlesModels.js");

exports.getArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query;

  selectArticles(topic, sort_by, order)
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

exports.postArticle = (request, response, next) => {
  const articleData = request.body;

  insertArticle(articleData)
    .then((insertedArticle) => selectArticleById(insertedArticle.article_id))
    .then((result) => {
      response.status(201).send({ postedArticle: result });
    })
    .catch(next);
};

//check if the article to delete was the last with that topic,
//in which case delete that topic
exports.deleteArticle = (request, response, next) => {
  const { article_id } = request.params;

  deleteArticleById(article_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};
