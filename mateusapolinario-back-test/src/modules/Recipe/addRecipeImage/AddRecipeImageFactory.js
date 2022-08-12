const repository = require('../repository/RecipeRepository');
const { AddRecipeImageService } = require('./AddRecipeImageService');
const { AddRecipeImageController } = require('./AddRecipeImageController');

function buildInstance() {
  const service = new AddRecipeImageService(repository);
  const controller = new AddRecipeImageController(service);
  return controller;
}

module.exports = { buildInstance };