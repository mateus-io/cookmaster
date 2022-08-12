const recipeDTO = require('./RecipeDTO');
const recipeSchema = require('./RecipeSchema');

module.exports = {
  ...recipeDTO,
  ...recipeSchema,
};