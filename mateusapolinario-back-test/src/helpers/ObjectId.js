const mongoose = require('mongoose');

function generate(id) {
  let objectId = new mongoose.Types.ObjectId();
  if (id) {
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (err) { return null; }
  }
  return objectId;
}

module.exports = { generate };