const { User } = require('../../../models/User');

function insertOne(user) {
  const userSchema = new User(user);
  return userSchema.save();
}

function findOne(query, fields) {
  return User.findOne(query, fields).exec();
}

module.exports = { insertOne, findOne };