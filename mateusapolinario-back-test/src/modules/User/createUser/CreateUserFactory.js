const repository = require('../repository/UserRepository');
const { CreateUserService } = require('./CreateUserService');
const { CreateUserController } = require('./CreateUserController');

function buildInstance() {
  const service = new CreateUserService(repository);
  const controller = new CreateUserController(service);
  return controller;
}

module.exports = { buildInstance };