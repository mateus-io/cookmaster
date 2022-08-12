import { useState, useCallback } from 'react';
import { UserPreferences } from '../models/User';

type useUserPreferencesResponse = [
  userPreferences: UserPreferences,
  updateUserPreferences: (userPreferences: UserPreferences) => void
];

function useUserPreferences(): useUserPreferencesResponse {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    blockedIngredients: [],
  });

  const updateUserPreferences = useCallback((newUserPreferences: UserPreferences) => {
    setUserPreferences(newUserPreferences);
  }, []);

  return [userPreferences, updateUserPreferences];
};

export { useUserPreferences };