const User = require("../../models/User");
const UserType = require("./types");
const { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLBoolean } = require("graphql");

const getUserById = {
  type: UserType,
  description: "Get a single user",
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args) => {
    return await User.find({ id: args.id });
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

const checkLogin = {
  type: GraphQLBoolean,
  description: "Check login",
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(parent, args, { res}) {
    const user = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = user.password === args.password;
    if (!isMatch) {
      throw new Error("Password is incorrect");
    }

    res.cookie('sessionID', user.id, {
      httpOnly: true, // Cookie cannot be accessed by client-side scripts
      maxAge: 24 * 60 * 60 * 1000, // Cookie will expire in 24 hours
      // signed: true, // Cookie will be signed
      
    });

    return true;
  },
};

const logout = {
  type: GraphQLBoolean,
  description: "Logout",
  async resolve(parent, args, { res }) {
    res.clearCookie('sessionID');
    return true;
  },
};

module.exports = { getUserById, getUserByEmail, getAllUsers, checkLogin, logout };
