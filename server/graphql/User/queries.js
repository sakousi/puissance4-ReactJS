const User = require("../../models");
const UserType = require("./types");
const {GraphQLID, GraphQLNonNull} = require("graphql");

const user = {
  type: UserType,
  description: "Get a single user",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    return await User.findById(args.id);
  },
};

module.exports = { user };
