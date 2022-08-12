const Joi = require('joi');
const { RecipeRequestParamsDTO } = require('../../../models/Recipe');

const RequestSchema = Joi.object({
  params: RecipeRequestParamsDTO,
}).unknown(true);

module.exports = { RequestSchema };