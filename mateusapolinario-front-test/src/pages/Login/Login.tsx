import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as UserServices from '../../shared/services/UserServices';
import * as CookieHelper from '../../shared/helpers/Cookies';

import './LoginStyles.css';

function Login() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    const response = await UserServices.login(loginForm);
    if (response) {
      CookieHelper.store('auth-token', response.token, {
        domain: import.meta.env.VITE_DOMAIN,
      });
      navigate('/recipes', { replace: true });
    }
  }

  function changeInput(e: React.ChangeEvent<HTMLInputElement>){
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <main className='login'>
      <form onSubmit={submit} className='login-form'>
        <h1>Login</h1>
        <input onChange={changeInput} type='text' placeholder='Email' name='email' />
        <input onChange={changeInput} type='text' placeholder='Password' name='password' />
        <Link to='/signup'>Quero me cadastrar</Link>
        <button type='submit' >Entrar</button>
      </form>
    </main>
  )
}

export { Login };