const repository = require('../../User/repository/UserRepository');
const { LoginService } = require('./LoginService');
const { LoginController } = require('./LoginController');

function buildInstance() {
  const service = new LoginService(repository);
  const controller = new LoginController(service);
  return controller;
}

module.exports = { buildInstance };