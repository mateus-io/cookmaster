const repository = require('../repository/RecipeRepository');
const { UpdateRecipeService } = require('./UpdateRecipeService');
const { UpdateRecipeController } = require('./UpdateRecipeController');

function buildInstance() {
  const service = new UpdateRecipeService(repository);
  const controller = new UpdateRecipeController(service);
  return controller;
}

module.exports = { buildInstance };