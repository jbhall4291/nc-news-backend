const db = require("../db/connection");
const { selectArticleById } = require("./articlesModels");

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

/*
exports.insertArticleComment = (article_id, comment) => {
  if (!comment.username) {
    return Promise.reject({
      status: 400,
      msg: "comment is missing username",
    });
  }

  if (!comment.body) {
    return Promise.reject({
      status: 400,
      msg: "comment is missing body",
    });
  }

  return "all good here!"
};

// create a string like the below to INSERT
//const insertArticleCommentQueryString = `INSERT INTO comments VALUES ;`;

// return db.query(selectArticleByIdQueryString, [article_id]).then((result) => {
//   if (result.rowCount === 0) {
//     return Promise.reject({ status: 404, msg: "article_id not found" });
//   }
// })}

//   else {
//     const [article] = result.rows;
//     return article;
//   }
// ));

// 'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;',
//       formattedCommentData.map(
//         ({ body, author, article_id, votes = 0, created_at }) => [
//           body,
//           author,
//           article_id,
//           votes,
//           created_at,
//         ]
//       )
*/