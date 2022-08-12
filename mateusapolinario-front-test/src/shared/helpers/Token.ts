import * as CookieHelper from '../helpers/Cookies';

function getToken() {
  const token = CookieHelper.findOne('auth-token');
  if (!token) return '';
  return token.value;
};

function removeToken() {
  CookieHelper.remove('auth-token', import.meta.env.VITE_DOMAIN);
}

export { getToken, removeToken };