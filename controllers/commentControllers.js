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

/*
exports.postArticleComment = (request, response, next) => {
  const { article_id } = request.params;
  const comment = request.body;

  //check the article exists in DB
  selectArticleById(article_id)
    .then(() => {
      console.log(
        "select article by id has been succesfully invoked and promise fufilled"
      );
      //now invoke insertArticleComment from commentsModels which will check and insert the comment
    })
    .catch(next);
    
};
*/
