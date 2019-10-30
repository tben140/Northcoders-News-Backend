exports.formatDates = list => {
  const output = list.map(item => {
    let outputObj = {};
    outputObj.title = item.title;
    outputObj.topic = item.topic;
    outputObj.author = item.author;
    outputObj.body = item.body;
    outputObj.created_at = new Date(item.created_at);
    return outputObj;
  });
  // console.log("Format Dates output ->", output);
  return output;
};

exports.makeRefObj = list => {
  return list.reduce((acc, obj) => {
    acc[obj.title] = obj.article_id;
    return acc;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  // console.log("Comments ->", comments);
  const output = comments.map(item => {
    for (let i = 0; i < comments.length; i++) {
      let outputObj = {};
      outputObj.body = item.body;
      outputObj.article_id = articleRef[item.belongs_to];
      outputObj.author = item.created_by;
      outputObj.votes = item.votes;
      outputObj.created_at = new Date(item.created_at);
      // console.log("OutputObj ->", outputObj);
      return outputObj;
    }
  });
  return output;
};
