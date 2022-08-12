import { User, Login } from "../models/User";
import { api } from "../providers/ApiProvider";

async function login(data: Login){
  try {
    const { data: payload } = await api.post('/login', data);
    return payload;
  } catch (err: any) {
    return null;
  }
};

async function signUp(data: User){
  try {
    const { data: payload } = await api.post('/users', data);
    return payload;
  } catch (err: any) {
    return null;
  }
};

export {
  login,
  signUp
}