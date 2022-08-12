const { Router } = require('express');

const userRoutes = Router();

const {
  validateRequest,
  authMiddleware,
  validatePermissionCreateAdmin,
} = require('../middlewares');

const {
  createUserBuildInstance,
  CreateUserRequestSchema,
  createUserHandleStructureErrors,
} = require('../modules/User/createUser');

const {
  createAdminBuildInstance,
  CreateAdminRequestSchema,
  createAdminHandleStructureErrors,
} = require('../modules/User/createAdmin');

const createUserInstance = createUserBuildInstance();
const createAdminInstance = createAdminBuildInstance();

userRoutes.post('/',
  validateRequest(CreateUserRequestSchema),
  createUserHandleStructureErrors,
  createUserInstance.run);

userRoutes.post('/admin',
  validateRequest(CreateAdminRequestSchema),
  createAdminHandleStructureErrors,
  authMiddleware,
  validatePermissionCreateAdmin,
  createAdminInstance.run);

module.exports = { userRoutes };