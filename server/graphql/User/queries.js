const User = require("../../models/User");
const UserType = require("./types");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLBoolean } = require("graphql");
const { getToken } = require("../../middleware/authUser");

const getUserById = {
  type: UserType,
  description: "Get a single user",
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args, context) => {
    let userId = args?.id;
    if (!userId) {
      userId = jwt.decode(getToken(context.headers), process.env.JWT_SECRET)?.user?._id;
    }
    return await User.findOne({ id: userId });
  },
};

const getAllUsers = {
  type: new GraphQLList(UserType),
  description: "Get all users",
  async resolve() {
    return await User.find({});
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
    return await User.findOne({ email: args.email });
  },
};

module.exports = { getUserById, getUserByEmail, getAllUsers };
