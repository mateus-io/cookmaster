import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import * as UserServices from '../../shared/services/UserServices';

import './SignUpStyles.css';

function SignUp() {
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    const response = await UserServices.signUp(signUpForm);
    if (response) {
      navigate('/login', { replace: true });
    }
  }

  function changeInput(e: React.ChangeEvent<HTMLInputElement>){
    setSignUpForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, 
    }))
  }

  return (
    <main className="signup">
      <form onSubmit={submit} className="signup-form">
        <h1>Sign Up</h1>
        <input onChange={changeInput} type="text" placeholder="Name" name="name" />
        <input onChange={changeInput} type="text" placeholder="Email" name="email" />
        <input onChange={changeInput} type="text" placeholder="Password" name="password" />
        <Link to="/login">Já tenho uma conta</Link>
        <button type="submit" >Cadastrar</button>
      </form>
    </main>
  )
}

export { SignUp };