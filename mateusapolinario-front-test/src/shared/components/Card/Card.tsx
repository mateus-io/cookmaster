import { Link } from 'react-router-dom';
import './CardStyles.css';

import genericImage from '../../../assets/undraw_breakfast_psiw.png';

interface CardProps {
  image?: string;
  name: string;
  ingredients: string[];
  recipeId: string;
}

function Card({
  image,
  name,
  ingredients,
  recipeId
}: CardProps) {
  return (
    <div className="card">
      {
        <img src={image || genericImage} alt="Imagem de comida" />
      }
      <div className="card-content">
        <span className="name">{name}</span>
        <div className="ingredients">
          {
            ingredients.map((ingredient) => (
              <span>{ingredient}</span>
            ))
          }
        </div>
        <Link to={`/recipes/${recipeId}`}>
          <span className="know-more">Ver mais</span>
        </Link>
      </div>
    </div>
  )
}

export { Card };