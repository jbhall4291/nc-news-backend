const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
  if (isNaN(article_id) === true) {
    return Promise.reject({ status: 404, msg: "article_id not found" });
  }

  const selectArticleCommentsByIdQueryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;

  return db
    .query(selectArticleCommentsByIdQueryString, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "specified article_id has no comments",
        });
      } else {
        const comments = result.rows;
        return comments;
      }
    });
};
