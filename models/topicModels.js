const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query("SELECT * from topics;").then((results) => {
    return results;
  });
};

exports.insertTopic = (topicToInsert) => {
  if (!topicToInsert.slug) {
    return Promise.reject({
      status: 400,
      msg: "topic is missing slug",
    });
  }

  if (!topicToInsert.description) {
    return Promise.reject({
      status: 400,
      msg: "topic is missing description",
    });
  }

  // check topic slug is NOT in the topics table
  const selectTopicQueryString = `SELECT * FROM topics WHERE slug = $1;`;

  return db
    .query(selectTopicQueryString, [topicToInsert.slug])
    .then((result) => {
      if (result.rowCount !== 0) {
        return Promise.reject({
          status: 400,
          msg: "topic already exists",
        });
      }
    })
    .then(() => {
      const insertTopicQueryString = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`;

      return db
        .query(insertTopicQueryString, [
          topicToInsert.slug.toLowerCase(),
          topicToInsert.description,
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

exports.deleteEmptyTopics = () => {
  return db
    .query(
      `DELETE FROM topics
      WHERE NOT EXISTS (
        SELECT 1
        FROM articles
        WHERE topics.slug = articles.topic
      );`
    )
    .then((result) => {
      console.log(result.rows);
      return result;
    });
};
