
const schema = {
  type: "object",
  properties: {
    toDislikePostId: { type: "string", format: "mongoID" },
    isDisliked: { type: "boolean" }
  },
  required: [ "toDislikePostId", "isDisliked" ],
  additionalProperties: false
}

module.exports = schema;