const { selectUsers } = require("../models/userModels.js");

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((results) => {
      response.status(200).send({ allUsers: results });
    })
    .catch(next);
};
