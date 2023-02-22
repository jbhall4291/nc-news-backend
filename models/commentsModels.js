const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
  if (isNaN(article_id) === true) {
    //console.log("article id is not a number!!!!!!");
    return Promise.reject("article_id is not a number");
  }

  const selectArticleCommentsByIdQueryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;


  return db
    .query(selectArticleCommentsByIdQueryString, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        
        return Promise.reject("specified article_id has no comments");
      } else {
        const comments = result.rows;
        //console.log(comments + "<<<<<<<<")
        return comments;
      }
      
    });
};
