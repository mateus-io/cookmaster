import { Recipe } from '../models/Recipe';
import { api } from '../providers/ApiProvider';
import * as TokenHelper from '../helpers/Token';

async function listAll(){
  try {
    const { data: recipes } = await api.get('/recipes');
    return recipes;
  } catch (err: any) {
    return null;
  }
};

async function getOne(id: string) {
  try {
    const { data: recipe } = await api.get(`/recipes/${id}`);
    return recipe;
  } catch (err: any) {
    return null;
  }
}

async function insertOne(data: Recipe) {
  try {
    const { data: recipe } = await api.post('/recipes', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': TokenHelper.getToken(),
      }
    });
    return recipe;
  } catch (err: any) {
    return null;
  }
}

export {
  listAll,
  getOne,
  insertOne
}