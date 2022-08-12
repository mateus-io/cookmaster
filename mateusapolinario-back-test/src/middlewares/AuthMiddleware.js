const Token = require('../helpers/Token');
const { ERRORS } = require('../utils/Constants');

function authMiddleware(request, response, next) {
  const { authorization } = request.headers;
  try {
    const { id, email, role } = Token.decrypt(authorization);
    const userData = {
      id,
      email,
      role,
    };
    request.userData = userData;
    next();
  } catch (err) {
    response.status(401).json({ message: ERRORS.JWT_MALFORMED.message });
  }
}

module.exports = { authMiddleware };