function databaseHealthMiddleware(dbConnection) {
  return (_, response, next) => {
    if (!dbConnection) {
      return response.status(502).send('Database Connection Failed');
    }
    next();
  };
}

module.exports = { databaseHealthMiddleware };