exports.handleCustomErrors = (error, request, response, next) => {
  if (error === "article_id not found") {
    response.status(404).send({ msg: "article_id not found" });
  } else if (error === "article_id is not a number") {
    response
      .status(400)
      .send({ msg: "bad request: article_id is not a number" });
  } else if (error === "specified article_id has no comments") {
    response.status(404).send({ msg: "specified article_id has no comments" });
  } else {
    next(error);
  }
};

exports.handle500Statuses = (error, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
};
