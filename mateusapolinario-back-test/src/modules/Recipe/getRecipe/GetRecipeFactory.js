const repository = require('../repository/RecipeRepository');
const { GetRecipeService } = require('./GetRecipeService');
const { GetRecipeController } = require('./GetRecipeController');

function buildInstance() {
  const service = new GetRecipeService(repository);
  const controller = new GetRecipeController(service);
  return controller;
}

module.exports = { buildInstance };