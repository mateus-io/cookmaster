const { ERRORS } = require('../../../utils/Constants');

function handleStructureErrors(err, _, response, next) {
  if (!err) next();
  else response.status(400).json({ message: ERRORS.INVALID_ENTRIES.message });
}

function handleRuntimeErrors(err, response) {
  response.status(500).json({ message: err.message });
}

module.exports = { handleRuntimeErrors, handleStructureErrors };