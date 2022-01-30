
const schema = {
  type: "object",
  properties: {
    jwt: { type: "string", minLength: 5},
  },
  required: [ "jwt" ],
  additionalProperties: false
}

module.exports = schema;