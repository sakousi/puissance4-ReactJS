// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

// Import the queries
const { getUserById, getUserByEmail, getAllUsers } = require("./User/queries");

// Import the mutations
const { updateUser } = require("./User/mutations");
const { register, login } = require("./User/authMutations");

// Define the query type
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Root query type",
  fields: {
    getUserById,
    getUserByEmail,
    getAllUsers,
  },
});

// Define the mutation type
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Root mutation type",
  fields: {
    updateUser,
    register,
    login,
  },
});

// Export the schema
module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
