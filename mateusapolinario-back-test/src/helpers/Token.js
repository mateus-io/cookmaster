const jwt = require('jsonwebtoken');
const { CustomException } = require('../utils/CustomException');
const { TOKEN_SECRET, ERRORS } = require('../utils/Constants');

function encrypt(payload) {
  try {
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1d' });
  } catch (err) {
    throw CustomException(err.message, ERRORS.JWT_MALFORMED.code);
  }
}

function decrypt(token) {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (err) {
    throw CustomException(err.message, ERRORS.JWT_MALFORMED.code);
  }
}

module.exports = { encrypt, decrypt };