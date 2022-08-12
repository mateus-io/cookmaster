const Joi = require('joi');

const AuthenticationRequestBodyDTO = Joi.object({
  email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
  password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
});

const AuthenticationRequestHeadersDTO = Joi.object({
    authorization: Joi.string()
        .required(),
}).unknown(true);

module.exports = { AuthenticationRequestBodyDTO, AuthenticationRequestHeadersDTO };