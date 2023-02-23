const {
  selectAllArticles,
  selectArticleById,
} = require("../models/articlesModels.js");
const {
  selectArticleComments,
  insertArticleComment,
} = require("../models/commentsModels.js");

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

/*
exports.postArticleComment = (request, response, next) => {
  const { article_id } = request.params;
  const comment = request.body;

  //check the article exists in DB
  selectArticleById(article_id)
    .then((result) => {
      console.log(result);
      //now invoke insertArticleComment from commentsModels which will check and insert the comment
    })
    .catch(next);
};
*/