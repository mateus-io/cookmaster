import { Router } from './routes/Router'
import { UserPreferencesProvider } from './shared/contexts/user/UserProvider';

function App() {
  return (
    <UserPreferencesProvider>
      <Router />
    </UserPreferencesProvider>
  );
};

export default App;
