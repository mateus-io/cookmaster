const Joi = require('joi');
const { AuthenticationRequestBodyDTO } = require('../../../models/Authentication');

const RequestSchema = Joi.object({
  body: AuthenticationRequestBodyDTO,
}).unknown(true);

module.exports = { RequestSchema };