const User = require("../../models");
const UserType = require("./types");
const {GraphQLID, GraphQLNonNull} = require("graphql");

const getUserById = {
  type: UserType,
  description: "Get a single user",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    console.log('grgrgrg');
    return await User.findById(args.id);
  },
};

module.exports = { getUserById };
