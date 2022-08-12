const Joi = require('joi');
const { RecipeRequestParamsDTO } = require('../../../models/Recipe');
const {
  AuthenticationRequestHeadersDTO,
} = require('../../../models/Authentication/AuthenticationDTO');

const RequestSchema = Joi.object({
  params: RecipeRequestParamsDTO,
  headers: AuthenticationRequestHeadersDTO,
}).unknown(true);

module.exports = { RequestSchema };