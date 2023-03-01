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
      updateUser: allow,
    },
    QueryType: {
      checkLogin: allow,
    },
  },
  {
    fallbackError: async (thrownThing, parent, args, context, info) => {
      if (thrownThing instanceof Error) {
        // expected errors
        return thrownThing;
      } else {
        // what the hell got thrown
        console.error("The resolver threw something that is not an error.");
        console.error(thrownThing);
        return new Error("Internal server error", "ERR_INTERNAL_SERVER");
      }
    },
  }
);

module.exports = { permissions };
