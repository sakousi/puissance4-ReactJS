const Game = require("../../models/Game");
const {
  gameInputType,
  eloChangeInputType,
  playerInputType,
} = require("./inputTypes");
const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");
const { GraphQLDate } = require("graphql-scalars");

const updateGame = {
  type: GraphQLBoolean,
  description: "Update a single game",
  args: {
    player1: {
      type: new GraphQLNonNull(playerInputType),
    },
    player2: {
      type: new GraphQLNonNull(playerInputType),
    },
    winner: {
      type: GraphQLID,
    },
    dateStarted: {
      type: GraphQLDate,
    },
    eloChange: {
      type: eloChangeInputType,
    },
  },
  resolve: async (parent, args, context) => {
    return updateGameData(args);
  },
};

async function updateGameData(args) {
  const game = new Game({ ...args });
  const result = await game.save();
  return result.ok;
}

module.exports = {
  updateGame,
  updateGameData,
};
