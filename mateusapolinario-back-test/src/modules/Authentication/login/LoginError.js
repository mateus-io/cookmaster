const { ERRORS } = require('../../../utils/Constants');

function handleStructureErrors(err, _, response, next) {
  if (!err) next();
  else response.status(401).json({ message: ERRORS.ALL_FIELDS_MUST_BE_FILLED.message });
}

function handleRuntimeErrors(err, response) {
  switch (err.code) {
    case ERRORS.LOGIN_CREDENTIALS.code:
      response.status(401).json({ message: ERRORS.LOGIN_CREDENTIALS.message });
      break;
    case ERRORS.JWT_MALFORMED.code:
      response.status(401).json({ message: ERRORS.JWT_MALFORMED.message });
      break;
    default:
      response.status(500).json({ message: ERRORS.UNKNOWN.message });
  }
}

module.exports = { handleRuntimeErrors, handleStructureErrors };