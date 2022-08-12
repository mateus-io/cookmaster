const { Recipe } = require('../../../models/Recipe');

function insertOne(recipe) {
  const recipeSchema = new Recipe(recipe);
  return recipeSchema.save();
}

function findOne(query, fields) {
  return Recipe.findOne(query, fields).exec();
}

function findAll(query, fields) {
  return Recipe.find(query, fields).exec();
}

function findById(id) {
  return Recipe.findById(id).exec();
}

function findByIdAndUpdate(id, recipe) {
  return Recipe.findByIdAndUpdate(id, recipe, { new: true }).exec();
}

function findByIdAndRemove(id) {
  return Recipe.findByIdAndRemove(id).exec();
}

module.exports = {
  insertOne,
  findOne,
  findAll,
  findById,
  findByIdAndUpdate,
  findByIdAndRemove,
};