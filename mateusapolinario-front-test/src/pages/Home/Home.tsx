import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../shared/components/Card/Card';
import * as TokenHelper from '../../shared/helpers/Token';

import './HomeStyles.css';

function Home() {
  const navigate = useNavigate();

  function logout() {
    TokenHelper.removeToken();
    navigate('/login', { replace: true });
  }

  return (
    <main className="home">
      <header>
        <nav>
          <ul>
            <Link to="/preferences">
              <li>Preferências</li>
            </Link>
            <Link to="/recipes">
              <li>Ver Receitas</li>
            </Link>
            <Link to="/recipes/new">
              <li>Criar Receita</li>
            </Link>
          </ul>
          <div onClick={logout}>
            <span>SAIR</span>
          </div>
        </nav>
      </header>

      <article className="content">
        <Card
          image="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"
          ingredients={['Arroz', 'Feijão', 'Cenoura']}
          name="Beef"
          recipeId="recipeId"
        />
      </article>
    </main>
  );
}

export { Home };