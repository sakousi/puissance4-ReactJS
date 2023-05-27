const User = require("../../models/User");
const UserInputType = require("./inputTypes");
const UserType = require("./types");
const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} = require("graphql");
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
    const user = (
      await User.aggregate([
        {
          $match: {
            email: args.email,
          },
        },
        {
          $lookup: {
            from: "leaderboards",
            localField: "_id",
            foreignField: "player",
            as: "leaderboard",
          },
        },
        {
          $addFields: {
            elo: {
              $cond: {
                if: { $gt: [{ $size: "$leaderboard" }, 0] },
                then: { $arrayElemAt: ["$leaderboard.elo", 0] },
                else: "$$REMOVE",
              },
            },
          },
        },
        {
          $unset: "leaderboard",
        },
      ])
    ).shift();

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
    return { token, user };
  },
};

const changePassword = {
  type: GraphQLBoolean,
  description: "Change user password",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    currentPassword: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, context) {
    const user = await User.findOne({ email: args.email });
    const isMatch = await bcrypt.compare(args.currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Password is incorrect");
    }

    if (user) {
      const newEncodedPassword = await bcrypt.hash(args.newPassword, 12);

      try {
        await User.updateOne(
          { _id: user._id },
          { $set: { password: newEncodedPassword } }
        );
        return true;
      } catch (error) {
        throw new Error("error updating password");
      }
    } else {
      throw new Error("Acount not found");
    }
  },
};

module.exports = { register, login, changePassword };
