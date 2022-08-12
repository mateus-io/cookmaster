export type User = {
  name: string;
  email: string;
  password: string;
};

export type Login = {
  email: string;
  password: string;
};

export type UserPreferences = {
  blockedIngredients: string[];
};