const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');
const { User } = require('../../models');
const mongoose = require('mongoose');

const UserType = new GraphQLObjectType({
    name: 'User',
    description : 'User type',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    })
});

module.exports = UserType;