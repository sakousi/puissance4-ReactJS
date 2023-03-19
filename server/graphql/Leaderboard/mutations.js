const Leaderboard = require("../../models/Leaderboard");
const leaderboardInputType = require("./inputTypes");
const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");
const { getLeaderboardByUserId } = require("./queries");

const createLeaderboard = {
  type: GraphQLString,
  description: "Create a single leaderboard",
  args: {
    input: {
      type: new GraphQLNonNull(leaderboardInputType),
    },
  },
  resolve: async (parent, args) => {
    const leaderboard = new Leaderboard({
      ...args?.input,
    });
    const result = await leaderboard.save();
    return result.ok;
  },
};

const updateLeaderboard = {
  type: GraphQLBoolean,
  description: "Update a single leaderboard",
  args: {
    player: {
      type: new GraphQLNonNull(GraphQLID),
    },
    username: {
      type: GraphQLString,
    },
    wins: {
      type: GraphQLInt,
    },
    losses: {
      type: GraphQLInt,
    },
    draws: {
      type: GraphQLInt,
    },
  },
  resolve: async (parent, args, context) => {
    const { player, username, wins, losses, draws } = args;
    const leaderboard = await Leaderboard.findOne({ player: player });

    if (!leaderboard) {
      const newLeaderboard = new Leaderboard({ ...args });
      const result = await newLeaderboard.save();
      return result.ok;
    }

    try {
      await Leaderboard.updateOne(
        { _id: leaderboard._id },
        {
          $set: {
            wins: (leaderboard.wins += wins),
            losses: (leaderboard.losses += losses),
            draws: (leaderboard.draws += draws),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    const result = await leaderboard.save();

    return result.ok;
  },
};

module.exports = { createLeaderboard, updateLeaderboard };
