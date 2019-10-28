exports.formatDates = list => {
  // console.log("list before for loop ->", list);

  const output = list.map(item => {
    let outputObj = {};
    outputObj.title = item.title;
    outputObj.topic = item.topic;
    outputObj.author = item.author;
    outputObj.body = item.body;
    outputObj.created_at = new Date(item.created_at);
    return outputObj;
  });
  return output;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
