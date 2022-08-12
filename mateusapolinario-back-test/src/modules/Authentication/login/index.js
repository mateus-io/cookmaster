const { RequestSchema } = require('./LoginRequestSchema');
const { handleStructureErrors } = require('./LoginError');
const { buildInstance } = require('./LoginFactory');

module.exports = {
  LoginRequestSchema: RequestSchema,
  loginHandleStructureErrors: handleStructureErrors,
  loginBuildInstance: buildInstance,
};