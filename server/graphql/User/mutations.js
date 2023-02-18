const User = require("../../models/User");
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
    // console.log(user);
    // const result = await User.updateOne({ _id: user._id }, { $set: user });
    const result = await user.save();
    return result.ok;
  },
};

module.exports = { updateUser };
