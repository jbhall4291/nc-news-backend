const { fetchEndpoints } = require("../models/endpointModels");

exports.getEndpoints = (request, response, next) => {
  fetchEndpoints()
    .then((endpoints) => {
      response.status(200).send({ endpoints });
    })
    .catch(next);
};
