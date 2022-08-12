const Joi = require('joi');
const { RecipeRequestBodyDTO } = require('../../../models/Recipe/RecipeDTO');
const {
  AuthenticationRequestHeadersDTO,
} = require('../../../models/Authentication/AuthenticationDTO');

const RequestSchema = Joi.object({
  body: RecipeRequestBodyDTO,
  headers: AuthenticationRequestHeadersDTO,
}).unknown(true);

module.exports = { RequestSchema };