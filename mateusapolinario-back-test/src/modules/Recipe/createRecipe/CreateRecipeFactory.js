const repository = require('../repository/RecipeRepository');
const { CreateRecipeService } = require('./CreateRecipeService');
const { CreateRecipeController } = require('./CreateRecipeController');

function buildInstance() {
  const service = new CreateRecipeService(repository);
  const controller = new CreateRecipeController(service);
  return controller;
}

module.exports = { buildInstance };