const repository = require('../repository/UserRepository');
const { CreateAdminService } = require('./CreateAdminService');
const { CreateAdminController } = require('./CreateAdminController');

function buildInstance() {
  const service = new CreateAdminService(repository);
  const controller = new CreateAdminController(service);
  return controller;
}

module.exports = { buildInstance };