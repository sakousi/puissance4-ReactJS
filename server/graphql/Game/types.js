const { GraphQLObjectType, GraphQLID, GraphQLInt } = require('graphql');
const { Leaderboard } = require('../../models');
const mongoose = require('mongoose');
const { GraphQLDate } = require('graphql-scalars');

const eloChangeType = new GraphQLObjectType({
    name: "eloChange",
    description: "Elo change type",
    fields: () => ({
      player1EloChange: { type: GraphQLInt },
      player2EloChange: { type: GraphQLInt },
    }),
  });
  
  const gameType = new GraphQLObjectType({
    name: "game",
    description: "game type",
    fields: () => ({
      id: { type: GraphQLID },
      player1: { type: GraphQLID },
      player2: { type: GraphQLID },
      winner: { type: GraphQLID },
      dateStarted: { type: GraphQLDate },
      eloChange: { type: eloChangeType },
    }),
  });

module.exports = gameType;