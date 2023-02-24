const db = require("../db/connection");

exports.selectArticles = (articleQuery, next) => {
  const queryValues = [];

  let selectArticlesQueryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (articleQuery.topic) {
    queryValues.push(articleQuery.topic);
    selectArticlesQueryString += ` WHERE topic = $1`;
  }

  /*
  console.log(selectArticlesQueryString);
  //sort_by
  // if (articleQuery.sort_by) {
  //   const articlesSortedBy = articleQuery.sort_by;
  // }

  
  console.log(articleQuery.order + "<<<<<<<<<<");
  */
  selectArticlesQueryString +=
    " GROUP BY articles.article_id ORDER BY articles.created_at";




    console.log(articleQuery.order + "order specified")


  //order
  if (articleQuery.order) {
    queryValues.push(articleQuery.order);
    selectArticlesQueryString += ` $1`;
  } else {
    // default to DESC
    selectArticlesQueryString += ` DESC`;
  }

  selectArticlesQueryString += ";";
// watch out for the length and positioning of the values in query string, as they will change depending on how many queries have been pushed !!!!!
  console.log(queryValues)
  console.log(selectArticlesQueryString)

  return db
    .query(selectArticlesQueryString, queryValues)
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
