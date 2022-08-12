const { ADMIN_ROLE, ERRORS } = require('../utils/Constants');

async function validatePermissionCreateAdmin(request, response, next) {
  const { role } = request.userData;
  if (role === ADMIN_ROLE) return next();
  response.status(403).json({ message: ERRORS.ONLY_ADMINS.message });
}

module.exports = { validatePermissionCreateAdmin };