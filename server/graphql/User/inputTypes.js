const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
} = require("graphql");

const UserInputType = new GraphQLInputObjectType({
  name: "UserInput",
  description: "User input type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

module.exports = UserInputType;
