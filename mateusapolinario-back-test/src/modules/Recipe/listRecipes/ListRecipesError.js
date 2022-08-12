function handleRuntimeErrors(err, response) {
  response.status(500).json({ message: err.message });
}

module.exports = { handleRuntimeErrors };