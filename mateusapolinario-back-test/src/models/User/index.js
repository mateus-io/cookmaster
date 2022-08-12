const userDTO = require('./UserDTO');
const userSchema = require('./UserSchema');

module.exports = {
  ...userDTO,
  ...userSchema,
};