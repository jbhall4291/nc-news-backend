const db = require("../db/connection");

exports.selectArticles = (topic, sort_by, order, next) => {
  // default sortOption to 'created_at' if no sort_by given
  const sortOption = sort_by ? sort_by : "created_at";
  // check if sortOption matches one of the below possible columns, if not return 400 error
  const validSortOptions = [
    "article_id",
    "title",
    "topic",
    "author",
    "comment_count",
    "created_at",
    "votes",
    "article_img_url",
  ];
  if (!validSortOptions.includes(sortOption)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }

  // default currentOrder to 'desc' if no order given
  const currentOrder = order ? order : "desc";
  // check if currentOrder is either 'asc' or 'desc', if not return 400 error
  if (!["asc", "desc"].includes(currentOrder)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  let selectArticlesQueryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,
  articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles articles
  LEFT JOIN comments comments
  ON comments.article_id = articles.article_id`;

  // if a topic query was passed, build it into the db query string
  // if there wasn't a topic specified, return all topics with no need
  // for a WHERE clause at all
  if (topic) {
    selectArticlesQueryString += ` WHERE articles.topic = '${topic}'`;
  }

  // special handling for sorting by comment_count as it's an alias rather than a column on articles, so can't use articles.comment_count
  if (sortOption === "comment_count") {
    selectArticlesQueryString += ` GROUP BY articles.article_id ORDER BY comment_count ${currentOrder};`;
  } else {
    selectArticlesQueryString += ` GROUP BY articles.article_id ORDER BY articles.${sortOption} ${currentOrder};`;
  }

  return db
    .query(selectArticlesQueryString)
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "no articles found" });
      }
      return results;
    })
    .catch(next);
};

exports.selectArticleById = (article_id, next) => {
  if (isNaN(article_id) === true) {
    return Promise.reject({ status: 400, msg: "article_id is not a number" });
  }

  // const selectArticleByIdQueryString = `SELECT * FROM articles WHERE article_id = $1;`;

  const selectArticleByIdQueryString = `
        SELECT a.*,  COUNT(C.article_id) AS comment_count
        FROM articles a 
        LEFT JOIN comments c 
        ON c.article_id = a.article_id 
        WHERE a.article_id = $1 
        GROUP BY a.article_id;
        `;

  return db
    .query(selectArticleByIdQueryString, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      } else {
        const [article] = result.rows;
        return article;
      }
    })
    .catch(next);
};

exports.updateArticle = (article_id, patchData, next) => {
  if (!patchData.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "inc_votes property missing",
    });
  }

  if (isNaN(patchData.inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "inc_votes value must be a number",
    });
  }

  const updateArticleByIdQueryString = `UPDATE articles SET votes = (votes + $2) WHERE article_id = $1 RETURNING *;`;

  return db
    .query(updateArticleByIdQueryString, [article_id, patchData.inc_votes])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      } else {
        const [article] = result.rows;
        return article;
      }
    })
    .catch(next);
};

exports.insertArticle = (articleData) => {
  if (!articleData.author) {
    return Promise.reject({
      status: 400,
      msg: "article is missing author",
    });
  }

  if (!articleData.title) {
    return Promise.reject({
      status: 400,
      msg: "article is missing title",
    });
  }

  if (!articleData.body) {
    return Promise.reject({
      status: 400,
      msg: "article is missing body",
    });
  }

  if (!articleData.topic) {
    return Promise.reject({
      status: 400,
      msg: "article is missing topic",
    });
  }

  // check username is in the users table
  const selectUserQueryString = `SELECT * FROM users WHERE username = $1;`;

  return db
    .query(selectUserQueryString, [articleData.author])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "username does not exist",
        });
      } else {
        const user = result.rows;
        return user;
      }
    })
    .then(() => {
      const insertArticleQueryString = `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;

      return db
        .query(insertArticleQueryString, [
          articleData.author,
          articleData.title,
          articleData.body,
          articleData.topic,
          articleData.article_img_url ||
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
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
    });
};

exports.deleteArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "article_id is not a number" });
  }

  // Remove any comments associated with the article
  const deleteArticlesComments = `DELETE FROM comments WHERE article_id = $1;`;
  return db
    .query(deleteArticlesComments, [article_id])
    .then(() => {
      // Delete the article itself
      const deleteArticleByIdQueryString = `DELETE FROM articles WHERE article_id = $1;`;
      return db.query(deleteArticleByIdQueryString, [article_id]);
    })
    .then((deleteResult) => {
      if (deleteResult.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found",
        });
      } else {
        const article = deleteResult.rows;
        return article;
      }
    });
};
