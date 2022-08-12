const Joi = require('joi');
const { UserRequestBodyDTO } = require('../../../models/User/UserDTO');
const {
  AuthenticationRequestHeadersDTO,
} = require('../../../models/Authentication/AuthenticationDTO');

const RequestSchema = Joi.object({
  body: UserRequestBodyDTO,
  headers: AuthenticationRequestHeadersDTO,
}).unknown(true);

module.exports = { RequestSchema };