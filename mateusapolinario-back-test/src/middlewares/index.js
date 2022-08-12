const { authMiddleware } = require('./AuthMiddleware');
const { databaseHealthMiddleware } = require('./DatabaseHealthMiddleware');
const { validatePermissionCreateAdmin } = require('./ValidatePermissionCreateAdmin');
const {
  validatePermissionManipulateOneRecipe,
} = require('./ValidatePermissionManipulateOneRecipe');
const { validateRequest } = require('./ValidateRequest');
const { useParamToFileName } = require('./UseParamToFileName');

module.exports = {
  authMiddleware,
  databaseHealthMiddleware,
  validatePermissionCreateAdmin,
  validatePermissionManipulateOneRecipe,
  validateRequest,
  useParamToFileName,
};