const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {

  const token = getToken(req.headers);

  try {
    if (token) {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.verifiedUser = verified.user;
    }
    next();
  } catch (err) {
    console.log('error middleware', err);
    res.status(401).send(err);
  }
};

const getToken = (headers) => {
  return headers.authorization?.split(' ')[1] || '';
};

const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    console.log('error middleware', err);
    return false;
  }
};

module.exports = { authenticate, getToken, verifyToken };