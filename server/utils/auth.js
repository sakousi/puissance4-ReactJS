const jwt = require('jsonwebtoken');

const createJwtToken = (user) => {
  return jwt.sign(
    { user: { _id: user._id, username: user.username, email: user.email } },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = { createJwtToken };
