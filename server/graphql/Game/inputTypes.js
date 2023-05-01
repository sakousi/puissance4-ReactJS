const { GraphQLInputObjectType, GraphQLID, GraphQLInt } = require("graphql");
const { GraphQLDate } = require("graphql-scalars");

const eloChangeInputType = new GraphQLInputObjectType({
  name: "eloChangeInput",
  description: "Elo change input type",
  fields: () => ({
    player1EloChange: { type: GraphQLInt },
    player2EloChange: { type: GraphQLInt },
  }),
});

const gameInputType = new GraphQLInputObjectType({
  name: "gameInput",
  description: "game input type",
  fields: () => ({
    id: { type: GraphQLID },
    player1: { type: GraphQLID },
    player2: { type: GraphQLID },
    winner: { type: GraphQLID },
    dateStarted: { type: GraphQLDate },
    eloChange: { type: eloChangeInputType },
  }),
});

module.exports = { gameInputType, eloChangeInputType };
