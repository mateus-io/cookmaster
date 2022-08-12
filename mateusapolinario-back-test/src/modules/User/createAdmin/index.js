const { RequestSchema } = require('./CreateAdminRequestSchema');
const { handleStructureErrors } = require('./CreateAdminError');
const { buildInstance } = require('./CreateAdminFactory');

module.exports = {
  CreateAdminRequestSchema: RequestSchema,
  createAdminHandleStructureErrors: handleStructureErrors,
  createAdminBuildInstance: buildInstance,
};