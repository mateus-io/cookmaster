const USER_ROLE = 'user';
const ADMIN_ROLE = 'admin';
const TOKEN_SECRET = '1F3CE40415A2081FA3EEE75FC39FFF8E56C22270D1A978A7249B592DCEBD20B4';
const CDN = 'localhost:3000';
const MAX_IMAGE_SIZE_IN_BYTES = 10 * 1024 * 1024;

const ERRORS = {
  UNKNOWN: {
    message: 'Unknown error',
    code: 10000,
  },
  EMAIL_ALREADY_EXISTS: {
    message: 'Email already registered',
    code: 11000,
  },
  LOGIN_CREDENTIALS: {
    message: 'Incorrect username or password',
    code: 12000,
  },
  JWT_MALFORMED: {
    message: 'jwt malformed',
    code: 13000,
  },
  RECIPE_NOT_FOUND: {
    message: 'recipe not found',
    code: 14000,
  },
  ONLY_ADMINS: {
    message: 'Only admins can register new admins',
    code: 15000,
  },
  RECIPE_BELONGS_TO_ANOTHER_USER: {
    message: 'recipe belongs to another user',
    code: 16000,
  },
  ALL_FIELDS_MUST_BE_FILLED: {
    message: 'All fields must be filled',
    code: 17000,
  },
  MISSING_AUTH_TOKEN: {
    message: 'missing auth token',
    code: 18000,
  },
  INVALID_ENTRIES: {
    message: 'Invalid entries. Try again.',
    code: 19000,
  },
};

module.exports = {
  USER_ROLE,
  ADMIN_ROLE,
  TOKEN_SECRET,
  CDN,
  MAX_IMAGE_SIZE_IN_BYTES,
  ERRORS,
};