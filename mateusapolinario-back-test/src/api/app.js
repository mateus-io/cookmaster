const express = require('express');
require('dotenv').config();
const { createEndpoints } = require('../routes');
const { configure } = require('../configs');

const app = express();

configure(app);
createEndpoints(app);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
