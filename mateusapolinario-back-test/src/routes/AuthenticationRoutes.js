const { Router } = require('express');

const authenticationRoutes = Router();

const { validateRequest } = require('../middlewares/ValidateRequest');
const {
  loginBuildInstance,
  LoginRequestSchema,
  loginHandleStructureErrors,
} = require('../modules/Authentication/login');

const loginInstance = loginBuildInstance();

authenticationRoutes.post('/',
  validateRequest(LoginRequestSchema),
  loginHandleStructureErrors,
  loginInstance.run);

module.exports = { authenticationRoutes };