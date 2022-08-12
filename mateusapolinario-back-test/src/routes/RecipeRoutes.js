const { Router } = require('express');
const multer = require('multer');

const recipeRoutes = Router();

const {
  authMiddleware,
  validatePermissionManipulateOneRecipe,
  validateRequest,
  useParamToFileName,
} = require('../middlewares');

const { MulterConfigImg } = require('../configs');

const {
  createRecipeBuildInstance,
  CreateRecipeRequestSchema,
  createRecipeHandleStructureErrors,
} = require('../modules/Recipe/createRecipe');

const { listRecipesBuildInstance } = require('../modules/Recipe/listRecipes');

const {
  getRecipeBuildInstance,
  GetRecipeRequestSchema,
  getRecipeHandleStructureErrors,
} = require('../modules/Recipe/getRecipe');

const {
  updateRecipeBuildInstance,
  UpdateRecipeRequestSchema,
  updateRecipeHandleStructureErrors,
} = require('../modules/Recipe/updateRecipe');

const {
  deleteRecipeBuildInstance,
  DeleteRecipeRequestSchema,
  deleteRecipeHandleStructureErrors,
} = require('../modules/Recipe/deleteRecipe');

const {
  addRecipeImageBuildInstance,
  AddRecipeImageRequestSchema,
  addRecipeImageHandleStructureErrors,
} = require('../modules/Recipe/addRecipeImage');

const createRecipeInstance = createRecipeBuildInstance();
const listRecipesInstance = listRecipesBuildInstance();
const getRecipeInstance = getRecipeBuildInstance();
const updateRecipeInstance = updateRecipeBuildInstance();
const deleteRecipeInstance = deleteRecipeBuildInstance();
const addRecipeImageInstance = addRecipeImageBuildInstance();

recipeRoutes.post('/',
  validateRequest(CreateRecipeRequestSchema),
  createRecipeHandleStructureErrors,
  authMiddleware,
  createRecipeInstance.run);

recipeRoutes.get('/', listRecipesInstance.run);

recipeRoutes.get('/:id',
  validateRequest(GetRecipeRequestSchema),
  getRecipeHandleStructureErrors,
  getRecipeInstance.run);

recipeRoutes.put('/:id',
  validateRequest(UpdateRecipeRequestSchema),
  updateRecipeHandleStructureErrors,
  authMiddleware,
  validatePermissionManipulateOneRecipe,
  updateRecipeInstance.run);

recipeRoutes.delete('/:id',
  validateRequest(DeleteRecipeRequestSchema),
  deleteRecipeHandleStructureErrors,
  authMiddleware,
  validatePermissionManipulateOneRecipe,
  deleteRecipeInstance.run);

recipeRoutes.put('/:id/image',
  validateRequest(AddRecipeImageRequestSchema),
  addRecipeImageHandleStructureErrors,
  authMiddleware,
  validatePermissionManipulateOneRecipe,
  useParamToFileName('id'),
  multer(MulterConfigImg).single('image'),
  addRecipeImageInstance.run);

module.exports = { recipeRoutes };