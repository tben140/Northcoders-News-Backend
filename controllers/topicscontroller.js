const { selectTopics } = require("../models/topicsmodel.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(console.log);
};
