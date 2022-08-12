function useParamToFileName(param) {
  return (request, _, next) => {
    request.targetFileName = request.params[param];
    next();
  };
}

module.exports = { useParamToFileName };