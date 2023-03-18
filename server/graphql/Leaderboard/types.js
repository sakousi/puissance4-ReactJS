const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt } = require('graphql');
const { Leaderboard } = require('../../models');
const mongoose = require('mongoose');

const leaderboardType = new GraphQLObjectType({
    name: 'Leaderboard',
    description : 'Leaderboard type',
    fields: () => ({
        id: { type: GraphQLID },
        player: { type: GraphQLID },
        wins: { type: GraphQLInt },
        losses: { type: GraphQLInt },
        draws: { type: GraphQLInt },
    })
});

module.exports = leaderboardType;