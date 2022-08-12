import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as RecipeServices from '../../shared/services/RecipeServices';
import * as StringHelper from '../../shared/helpers/String';
import { AVAILABLE_INGREDIENTS } from '../../shared/utils/Constants';

import './CreateRecipeStyles.css';

function CreateRecipe() {
  const [createRecipeForm, setCreateRecipeForm] = useState({
    name: '',
    ingredients: '',
    preparation: ''
  });

  const navigate = useNavigate();

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    const response = await RecipeServices.insertOne(createRecipeForm);
    if (response) {
      navigate('/recipes', { replace: true });
    }
  }

  function changeInput(e: React.ChangeEvent<HTMLInputElement>){
    setCreateRecipeForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, 
    }));
  }
  
  function changeCheckbox(e: React.ChangeEvent<HTMLInputElement>){
    setCreateRecipeForm((prev: any) => ({
      ...prev,
      [e.target.name]: StringHelper
        .toggleSubString(prev[e.target.name] || '', e.target.value), 
    }));
  }

  return (
    <main className="create-recipe-content">
      <form onSubmit={submit} className="create-recipe-form">
        <h1>Cadastrar uma nova receita</h1>
        <input onChange={changeInput} type="text" placeholder="Name" name="name" />
        <fieldset>
          <legend>Escolha os ingredientes:</legend>
          {
            AVAILABLE_INGREDIENTS.map((ingredient) => (
              <div key={ingredient.id}>
                <input
                  onChange={changeCheckbox}
                  type="checkbox"
                  id={ingredient.id}
                  name="ingredients"
                  value={ingredient.value}
                />
                <label htmlFor={ingredient.id}>{ingredient.value}</label>
              </div>
            ))
          }
        </fieldset>
        <input
          onChange={changeInput}
          type="text"
          placeholder="Modo de preparo"
          name="preparation"
        />
        <button type="submit" >Cadastrar Receita</button>
      </form>
    </main>
  )
}

export { CreateRecipe };