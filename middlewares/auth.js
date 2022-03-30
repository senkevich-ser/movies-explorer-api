const jwt = require('jsonwebtoken');
const UnAutorized = require('../errors/UnAutorizedErr');
const { JWT_CODE } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAutorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_CODE);
  } catch (err) {
    throw new UnAutorized('Необходима авторизация');
  }

  req.user = payload;

  next();
};
