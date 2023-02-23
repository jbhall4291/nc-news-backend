exports.handle400Statuses = (error, request, response, next) => {
  if (error.status === 400) {
    response.status(400).send({ msg: error.msg });
  }

  if (error.status === 404) {
    response.status(404).send({ msg: error.msg });
  } 
  
  else {
    next(error);
  }
};

exports.handle500Statuses = (error, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
};
