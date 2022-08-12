const fs = require('fs');

function read(absolutePath) {
  try {
    return fs.readFileSync(absolutePath);
  } catch (_) {
    return null;
  }
}

function remove(absolutePath) {
  try {
    fs.unlinkSync(absolutePath);
    return { err: null };
  } catch (err) {
    return { err };
  }
}

module.exports = { read, remove };