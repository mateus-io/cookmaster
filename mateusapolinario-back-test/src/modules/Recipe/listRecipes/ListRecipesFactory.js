const repository = require('../repository/RecipeRepository');
const { ListRecipesService } = require('./ListRecipesService');
const { ListRecipesController } = require('./ListRecipesController');

function buildInstance() {
  const service = new ListRecipesService(repository);
  const controller = new ListRecipesController(service);
  return controller;
}

module.exports = { buildInstance };