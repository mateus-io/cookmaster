import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { RequireAuth } from '../shared/auth/RequireAuth';
import { Recipes } from '../pages/Recipes/Recipes';
import { Recipe } from '../pages/Recipe/Recipe';
import { Login } from '../pages/Login/Login';
import { SignUp } from '../pages/SignUp/SignUp';
import { CreateRecipe } from '../pages/CreateRecipe/CreateRecipe';
import { Home } from '../pages/Home/Home';

// function Login() {
//   const { updateUser, user } = useContext(AuthContext);
//   function login() {
//     updateUser({
//       name: 'Mateus',
//       email: 'mateusapolinario1229310@gmail.com',
//       role: 'user'
//     });
//     console.log(user);
//   }
//   return (
//     <>
//       <button onClick={login}>logar</button>
//       <Link to="/profile">Profile</Link>
//     </>
//   )
// }

// function Profile() {
//   const { user } = useContext(AuthContext);
//   console.log(import.meta.env.VITE_API);
//   if (!user) return null;
//   return (
//     <>
//       <h1>{`Nome: ${user.name}`}</h1>
//       <h1>{`Email: ${user.email}`}</h1>
//       <h1>{`Role: ${user.role}`}</h1>
//     </>
//   )
// }

function Router() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        {/* <Route path="profile" element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        } /> */}
        <Route path="recipes">
          <Route path=":recipeId" element={<Recipe />} />
          <Route path="new" element={<CreateRecipe />} />
          <Route index element={<Recipes />} />
        </Route>
      </Route>
    </Routes>
  );
}

export { Router };