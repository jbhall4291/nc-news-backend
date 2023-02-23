const {
  selectArticleComments,
  insertArticleComment,
} = require("../models/commentsModels.js");
const { selectArticleById } = require("../models/articlesModels");

exports.getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  // first check if article exists and we get the promise successfully returned

  Promise.all([
    selectArticleById(article_id),
    selectArticleComments(article_id),
  ])
    .then(([promise1Result, promise2Result]) => {
      response.status(200).send({ comments: promise2Result });
    })
    .catch(next);
};

exports.postArticleComment = (request, response, next) => {
  const { article_id } = request.params;
  const commentToInsert = request.body;

  // check the article exists in DB
  selectArticleById(article_id)
    .then(() => {
      // invoke insertArticleComment from commentsModels which will validate and insert the comment
      insertArticleComment(article_id, commentToInsert);
    })
    // .then((result) => {
    //   response.status(201).send({ insertedComment: result });
    // })
    .catch(next);
};
