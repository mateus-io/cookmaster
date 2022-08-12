import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Recipe as RecipeModel } from '../../shared/models/Recipe';
import * as RecipeServices from '../../shared/services/RecipeServices';

import './RecipeStyles.css';

import genericImage from '../../assets/undraw_breakfast_psiw.png';

function Recipe() {
  const [recipe, setRecipe] = useState<RecipeModel | null>(null);
  const [loading, setLoading] = useState(false);

  const { recipeId } = useParams();

  async function execute() {
    setLoading(true);
    const retrievedRecipe = await RecipeServices.getOne(recipeId || '');
    if (retrievedRecipe) {
      setRecipe(retrievedRecipe);
    }
    setLoading(false);
  }

  const retrieveRecipe = useCallback(execute, []);

  useEffect(() => {
    retrieveRecipe();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (!recipe) {
    return <h1>Not Found</h1>;
  }
  
  return (
    <main className="recipe">
      <h1>
        {recipe.name}
      </h1>

      <img src={recipe.image || genericImage} alt="Imagem de comida" />
      
      <div className="ingredients">
        {
          recipe.ingredients.split(';').filter((igr) => igr).map((ingredient) => (
            <span>{ingredient}</span>
          ))
        }
      </div>

      <p>
        {recipe.preparation}
      </p>
    </main>
  )
}

export { Recipe };