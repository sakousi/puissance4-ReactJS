const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = require("graphql");
const { User } = require("../../models");
const { Leaderboard } = require("../../models");
const mongoose = require("mongoose");
const { GraphQLDateTime } = require("graphql-scalars");
const leaderboardType = require("../Leaderboard/types");

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (parent) => parent._id.toString(),
    },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    lastConnexion: { type: GraphQLDateTime },
    elo: { type: GraphQLInt },
  }),
});

module.exports = UserType;
