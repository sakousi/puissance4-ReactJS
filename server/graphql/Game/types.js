const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } = require("graphql");
const { Leaderboard } = require("../../models");
const mongoose = require("mongoose");
const { GraphQLDate } = require("graphql-scalars");

const eloChangeType = new GraphQLObjectType({
  name: "eloChange",
  description: "Elo change type",
  fields: () => ({
    player1EloChange: { type: GraphQLInt },
    player2EloChange: { type: GraphQLInt },
  }),
});

const playerType = new GraphQLObjectType({
  name: "player",
  description: "player type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    elo: { type: GraphQLInt },
  }),
});

const gameType = new GraphQLObjectType({
  name: "game",
  description: "game type",
  fields: () => ({
    id: { type: GraphQLID },
    player1: { type: playerType },
    player2: { type: playerType },
    winner: { type: GraphQLID },
    dateStarted: { type: GraphQLDate },
    eloChange: { type: eloChangeType },
  }),
});

module.exports = gameType;
