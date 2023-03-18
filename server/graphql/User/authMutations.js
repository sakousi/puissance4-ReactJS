const User = require("../../models/User");
const UserInputType = require("./inputTypes");
const UserType = require("./types");
const { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLObjectType } = require("graphql");
const jwt = require("jsonwebtoken");
const getToken = require("../../middleware/authUser");
const bcrypt = require("bcryptjs");
const { createJwtToken } = require("../../utils/auth");

const register = {
  type: GraphQLBoolean,
  description: "Register a new user",
  args: {
    input: {
      type: new GraphQLNonNull(UserInputType),
    },
  },
  async resolve(parent, args) {
    const param = args?.input;
    param.password = await bcrypt.hash(param.password, 12);
    const user = new User(param);
    const result = await user.save();
    return result.ok;
  },
};

const login = {
  type: new GraphQLObjectType({
    name: "Login",
    fields: () => ({
      token: { type: GraphQLString },
      user: { type: UserType },
    }),
  }),
  description: "Login a user",
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(parent, args) {
    const user = await User.findOne({ email: args.email });

    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) {
      throw new Error("Password is incorrect");
    }

    user.lastConnexion = new Date();
    try {
      await User.updateOne(
        { _id: user._id },
        { $set: { lastConnexion: new Date() } }
      );
    } catch (error) {
      console.log(error);
    }

    const token = createJwtToken(user);
    return {token, user};
  },
};

module.exports = { register, login };
