const repository = require('../repository/RecipeRepository');
const { DeleteRecipeService } = require('./DeleteRecipeService');
const { DeleteRecipeController } = require('./DeleteRecipeController');

function buildInstance() {
  const service = new DeleteRecipeService(repository);
  const controller = new DeleteRecipeController(service);
  return controller;
}

module.exports = { buildInstance };