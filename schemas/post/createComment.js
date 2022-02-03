
const schema = {
  type: "object",
  properties: {
    postId: { type: "string", format: "mongoID" },
    text: { type: "string", minLength: 1},
  },
  required: [ "postId", "text" ],
  additionalProperties: false
}

module.exports = schema;