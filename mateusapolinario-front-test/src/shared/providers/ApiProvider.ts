import axios from 'axios';
import { DEFAULT_HEADER } from '../utils/Constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: DEFAULT_HEADER
});

function onResponseSuccess(response: any) {
  return response;
}

function onResponseError(error: any) {
  console.log(error);
  const {response} = error;
  if (response.status === 401) {}
  return error;
}

api.interceptors.response.use(onResponseSuccess, onResponseError);

export { api };