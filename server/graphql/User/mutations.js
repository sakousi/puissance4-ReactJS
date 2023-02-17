const User = require("../../models");
const UserInputType = require("./inputTypes");
const { GraphQLNonNull, GraphQLString } = require("graphql");

// const updateUser = {
const updateUser = {
  type: GraphQLString,
  description: "Update a single user",
  args: {
    input: {
      type: new GraphQLNonNull(UserInputType),
    },
  },
  resolve: async (parent, args) => {
    const user = new User({
      ...args?.input,
    });
    const result = await User.updateOne({ _id: user._id }, { $set: user });
    return result;
  },
};

module.exports = { updateUser };
