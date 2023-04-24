const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
  } = require("graphql");
  
  const leaderboardInputType = new GraphQLInputObjectType({
    name: "leaderboarInput",
    description: "leaderboard input type",
    fields: () => ({
      id: { type: GraphQLID },
      player: { type: GraphQLID },
      username: { type: GraphQLString },
      wins: { type: GraphQLInt },
      losses: { type: GraphQLInt },
      draws: { type: GraphQLInt },
      elo: { type: GraphQLInt },
    }),
  });
  
  module.exports = leaderboardInputType;
  