const Joi = require('joi');
const { RecipeRequestBodyDTO, RecipeRequestParamsDTO } = require('../../../models/Recipe');
const {
  AuthenticationRequestHeadersDTO,
} = require('../../../models/Authentication/AuthenticationDTO');

const RequestSchema = Joi.object({
  body: RecipeRequestBodyDTO,
  params: RecipeRequestParamsDTO,
  headers: AuthenticationRequestHeadersDTO,
}).unknown(true);

module.exports = { RequestSchema };