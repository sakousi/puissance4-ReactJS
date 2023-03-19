const Leaderboard = require("../../models/Leaderboard");
const leaderboardType = require("./types");

const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
} = require("graphql");

const getLeaderboardById = {
  type: leaderboardType,
  description: "Get a single Leaderboard",
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args, context) => {
    return await Leaderboard.findOne({ id: args?.id });
  },
};

const getLeaderboardByUserId = {
  type: leaderboardType,
  description: "Get a single Leaderboard by user id",
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args, context) => {
    return await Leaderboard.findOne({ player: args?.id });
  },
};

const getAllLeaderboards = {
  type: new GraphQLList(leaderboardType),
  description: "Get all leaderboards",
  async resolve() {
    return await Leaderboard.find({}).sort({ wins: -1 }).limit(20);
  },
};

module.exports = {
  getLeaderboardById,
  getLeaderboardByUserId,
  getAllLeaderboards,
};
