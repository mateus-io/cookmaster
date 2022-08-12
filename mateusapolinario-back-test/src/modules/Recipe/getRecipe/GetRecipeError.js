const { ERRORS } = require('../../../utils/Constants');

function handleStructureErrors(err, _, response, next) {
  if (!err) next();
  else response.status(404).json({ message: ERRORS.RECIPE_NOT_FOUND.message });
}

function handleRuntimeErrors(err, response) {
  switch (err.code) {
    case ERRORS.RECIPE_NOT_FOUND.code:
      response.status(404).json({ message: ERRORS.RECIPE_NOT_FOUND.message });
      break;
    default:
      response.status(500).json({ message: err.message });
  }
}

module.exports = { handleRuntimeErrors, handleStructureErrors };