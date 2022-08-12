function validateRequest(schema) {
  return (request, _, next) => {
    const { error } = schema.validate(request);
    if (error) {
        next(`Errors: ${error.details.map((x) => `${x.message}`).join(', ')}`);
    } else {
        next();
    }
  };
}

module.exports = { validateRequest };