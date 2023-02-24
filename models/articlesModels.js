const db = require("../db/connection");

exports.selectArticles = (articleQuery, next) => {

console.log(articleQuery.length)

if (articleQuery) {console.log("no queries, return all articles!")}
//change querystring dynamically according to the passed query, if any
  
  
  
  const articlesWithTopic = articleQuery.topic;
  const selectArticlesQueryString =
  `SELECT * FROM articles WHERE topic = $1;`;
  
  /*
  if (articleQuery.sort_by) {
    const articlesSortedBy = articleQuery.sort_by;
  }

  if (articleQuery.order) {
    const articlesInOrderOf = article.order;
  }
*/

  /*
    "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;";
*/
  return db
    .query(selectArticlesQueryString, [articlesWithTopic])
    .then((results) => {
      return results;
    })
    .catch(next);
};

exports.selectArticleById = (article_id, next) => {
  if (isNaN(article_id) === true) {
    return Promise.reject({ status: 400, msg: "article_id is not a number" });
  }

  const selectArticleByIdQueryString = `SELECT * FROM articles WHERE article_id = $1;`;

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
