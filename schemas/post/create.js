
const schema = {
  type: "object",
  properties: {
    hashtags: {
      type: "array",
      minItems: 0,
      maxItems: 50,
      items: {
        type: "string",
        format: "hashtag"
      }
    },
    description: { type: "string", maxLength: 1000 },
  },
  required: [ "hashtags", "description" ],
  additionalProperties: false
}

module.exports = schema;