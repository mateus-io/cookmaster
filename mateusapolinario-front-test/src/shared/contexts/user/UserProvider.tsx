import { useUserPreferences } from '../../hooks/useUserPreferences';
import { UserPreferencesContext } from './UserPreferencesContext';

interface UserPreferencesProviderProps {
  children: JSX.Element;
}

function UserPreferencesProvider({ children }: UserPreferencesProviderProps): JSX.Element {
  const [userPreferences, updateUserPreferences] = useUserPreferences();
  return (
    <UserPreferencesContext.Provider value={{
      userPreferences,
      updateUserPreferences
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export { UserPreferencesProvider };