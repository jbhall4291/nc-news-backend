const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query("SELECT * from topics;").then((results) => {
    return results;
  });
};
