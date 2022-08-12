const { ERRORS } = require('../../../utils/Constants');

function handleStructureErrors(err, _, response, next) {
  if (!err) next();
  else response.status(400).json({ message: ERRORS.INVALID_ENTRIES.message });
}

function handleRuntimeErrors(err, response) {
  switch (err.code) {
    case ERRORS.EMAIL_ALREADY_EXISTS.code:
      response.status(409).json({ message: ERRORS.EMAIL_ALREADY_EXISTS.message });
      break;
    default:
      response.status(500).json({ message: ERRORS.UNKNOWN.message });
  }
}

module.exports = { handleRuntimeErrors, handleStructureErrors };