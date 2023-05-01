const Game = require("../../models/Game");
const gameType = require("./types");

const {
  GraphQLID,
  GraphQLList,
} = require("graphql");

const getGamesByUserId = {
    type: new GraphQLList(gameType),
    description: "Get a list of Games by user id",
    args: {
      id: {
        type: GraphQLID,
      },
    },
    resolve: async (parent, args, context) => {
      return await Game.find({
        $or: [{ player1: args.id }, { player2: args.id }],
      });
    },
  };


module.exports = {
    getGamesByUserId,
};
