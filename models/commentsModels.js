const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
  if (isNaN(article_id) === true) {
    return Promise.reject({ status: 400, msg: "article_id is not a number" });
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

exports.insertArticleComment = (article_id, commentToInsert) => {
  // if (!commentToInsert.username) {
  //   return Promise.reject({
  //     status: 400,
  //     msg: "comment is missing username",
  //   });
  // }

  // if (!commentToInsert.body) {
  //   return Promise.reject({
  //     status: 400,
  //     msg: "comment is missing body",
  //   });
  // }

  const insertArticleCommentQueryString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`;

  return db
    .query(insertArticleCommentQueryString, [
      commentToInsert.username,
      commentToInsert.body,
      article_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "not found",
        });
      }

      return result.rows[0];
    });
};
