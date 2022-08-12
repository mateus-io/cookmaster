const { ERRORS } = require('../../../utils/Constants');

function handleStructureErrors(err, _, response, next) {
  if (!err) return next();
  if (new RegExp(/headers\.authorization/i).test(err)) {
    return response.status(401).json({ message: ERRORS.MISSING_AUTH_TOKEN.message });
  }
  response.status(400).json({ message: ERRORS.INVALID_ENTRIES.message });
}

function handleRuntimeErrors(err, response) {
  response.status(500).json({ message: err.message });
}

module.exports = { handleRuntimeErrors, handleStructureErrors };