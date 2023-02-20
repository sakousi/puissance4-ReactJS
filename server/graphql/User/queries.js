const User = require("../../models/User");
const UserType = require("./types");
const { GraphQLID, GraphQLNonNull, GraphQLString } = require("graphql");

const getUserById = {
  type: UserType,
  description: "Get a single user",
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args) => {
    console.log("grgrgrg");
    return await User.find({ id: args.id });
  },
};

const getAllUsers = {
  type: UserType,
  description: "Get all users",
  resolve: async () => {
    const users = await User.find({});
    console.log(users);
    return users;
    return users.map((user) => {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
      };
    });
  },
};

const getUserByEmail = {
  type: UserType,
  description: "Get a single user by email",
  args: {
    email: {
      type: GraphQLString,
    },
  },
  async resolve(parent, args) {
    console.log(args.email);
    const user = await User.find({ email: args.email });
    console.log(user);
    // return await User.find({ email: args.email });
    return user.map((user) => {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
      };
    });
  },
};

module.exports = { getUserById, getUserByEmail, getAllUsers };
