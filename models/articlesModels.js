const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then((results) => {
      return results;
    });
};

exports.selectArticleById = (article_id) => {
  
  if (isNaN(article_id) === true) {
    
    return Promise.reject("article_id is not a number");
  }

  const selectArticleByIdQueryString = `SELECT * FROM articles WHERE article_id = $1;`;

  return db.query(selectArticleByIdQueryString, [article_id]).then((result) => {
    
    if (result.rowCount === 0) {
      return Promise.reject("article_id not found");
    } else {
      const [article] = result.rows;
      return article;
    }
  });
};
