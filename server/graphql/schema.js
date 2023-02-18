// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

// Import the queries
const { getUserById } = require("./User/queries");

// Import the mutations
const { updateUser } = require("./User/mutations");

// Define the query type
const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root query type",
  fields: {
    getUserById,
  },
});

// Define the mutation type
const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root mutation type",
  fields: {
    updateUser,
  },
});

// Export the schema
module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
