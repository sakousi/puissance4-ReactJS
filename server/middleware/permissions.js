const { allow, rule, shield } = require("graphql-shield");
const jwt = require("jsonwebtoken");
const getToken = require("./authUser");

const isAuthenticated = rule({ cache: "contextual" })(
  (parent, args, context) => {
    return !!jwt.decode(getToken(context.headers), process.env.JWT_SECRET)?.user
      ?._id;
  }
);

const permissions = shield(
  {
    MutationType: {
      register: allow,
      login: allow,
      changePassword: allow,
      updateUser: allow,
      createLeaderboard: allow,
      updateLeaderboard: allow,
      updateGame: allow,
    },
    QueryType: {
      getUserById: allow,
      getUserByEmail: allow,
      getAllUsers: allow,
      getLeaderboardById: allow,
      getLeaderboardByUserId: allow,
      getAllLeaderboards: allow,
      getGamesByUserId: allow,
    },
  },
  {
    fallbackError: async (thrownThing, parent, args, context, info) => {
      if (thrownThing instanceof Error) {
        return thrownThing;
      } else {
        console.error("The resolver threw something that is not an error.");
        console.error(thrownThing);
        return new Error("Internal server error", "ERR_INTERNAL_SERVER");
      }
    },
  }
);

module.exports = { permissions };
