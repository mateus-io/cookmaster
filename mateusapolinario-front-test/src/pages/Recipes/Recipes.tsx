import { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { Card } from '../../shared/components/Card/Card';
import { Recipe } from '../../shared/models/Recipe';
import * as RecipeServices from '../../shared/services/RecipeServices';

import './RecipesStyles.css';

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  async function execute() {
    const retrievedRecipes = await RecipeServices.listAll();
    if (retrievedRecipes) {
      setRecipes(retrievedRecipes);
    }
  }

  const retrieveRecipes = useCallback(execute, []);

  useEffect(() => {
    retrieveRecipes();
  }, []);
  
  return (
    <>
      <h1 className="recipes-title">Receitas</h1>
      <main className="recipes">
        {
          recipes.map((recipe) => (
            <Card
              key={recipe._id}
              ingredients={recipe.ingredients.split(';').filter((igr) => igr)}
              name={recipe.name}
              recipeId={recipe._id!}
            />
          ))
        }
      </main>
    </>
  )
}

export { Recipes };