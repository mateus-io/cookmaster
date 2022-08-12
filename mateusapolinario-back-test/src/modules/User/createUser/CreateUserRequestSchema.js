const Joi = require('joi');
const { UserRequestBodyDTO } = require('../../../models/User/UserDTO');

const RequestSchema = Joi.object({
  body: UserRequestBodyDTO,
}).unknown(true);

module.exports = { RequestSchema };