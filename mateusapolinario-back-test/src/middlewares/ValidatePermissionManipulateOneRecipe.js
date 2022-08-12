const ObjectId = require('../helpers/ObjectId');
const repository = require('../modules/Recipe/repository/RecipeRepository');
const { ADMIN_ROLE, ERRORS } = require('../utils/Constants');

async function validatePermissionManipulateOneRecipe(request, response, next) {
  const { id } = request.params;
  const { role, id: userId } = request.userData;
  if (role === ADMIN_ROLE) return next();

  const objectId = ObjectId.generate(id);
  const recipe = await repository.findById(objectId);
  if (!recipe) return response.status(404).json({ message: ERRORS.RECIPE_NOT_FOUND.message });

  const userIdFromRecipe = recipe.userId.toString();
  if (userIdFromRecipe !== userId) { 
    return response.status(401).json({ message: ERRORS.RECIPE_BELONGS_TO_ANOTHER_USER.message });
  }

  next();
}

module.exports = { validatePermissionManipulateOneRecipe };