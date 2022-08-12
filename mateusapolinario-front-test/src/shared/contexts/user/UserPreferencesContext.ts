import { createContext } from 'react';
import { UserPreferences } from '../../models/User';

interface IUserPreferencesContext {
  userPreferences: UserPreferences;
  updateUserPreferences(user: UserPreferences): void;
}

export const initialState: IUserPreferencesContext = {
  userPreferences: { blockedIngredients: [] },
  updateUserPreferences: (_) => {},
}

export const UserPreferencesContext = createContext<IUserPreferencesContext>(initialState);