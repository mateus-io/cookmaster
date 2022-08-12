const express = require('express');
const path = require('path');
const { userRoutes } = require('./UserRoutes');
const { recipeRoutes } = require('./RecipeRoutes');
const { authenticationRoutes } = require('./AuthenticationRoutes');

function createEndpoints(app) {
  app.use('/users', userRoutes);
  app.use('/recipes', recipeRoutes);
  app.use('/login', authenticationRoutes);
  app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));
}

module.exports = {
  createEndpoints,
};