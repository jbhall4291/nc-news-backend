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
    "body",
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
  // if there wasn't a topic specifed, return all topics with no need
  // for a WHERE clause at all
  if (topic) {
    selectArticlesQueryString += ` WHERE articles.topic = '${topic}'`;
  }

  selectArticlesQueryString += ` GROUP BY articles.article_id ORDER BY articles.${sortOption} ${currentOrder};`;

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
