exports.formatDates = (list) => {
  const output = list.map((item) => {
    let outputObj = {}
    outputObj.title = item.title
    outputObj.topic = item.topic
    outputObj.author = item.author
    outputObj.body = item.body
    outputObj.votes = item.votes
    outputObj.created_at = new Date(item.created_at)
    return outputObj
  })
  return output
}

exports.makeRefObj = (list) => {
  return list.reduce((acc, obj) => {
    acc[obj.title] = obj.article_id
    return acc
  }, {})
}

exports.formatComments = (comments, articleRef) => {
  const output = comments.map((item) => {
    let outputObj = {}
    outputObj.body = item.body
    outputObj.article_id = articleRef[item.belongs_to]
    outputObj.author = item.created_by
    outputObj.votes = item.votes
    outputObj.created_at = new Date(item.created_at)
    return outputObj
  })
  return output
}
