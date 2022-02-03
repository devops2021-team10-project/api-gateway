
const schema = {
  type: "object",
  properties: {
    toLikePostId: { type: "string", format: "mongoID" },
    isLiked: { type: "boolean" }
  },
  required: [ "toLikePostId", "isLiked" ],
  additionalProperties: false
}

module.exports = schema;