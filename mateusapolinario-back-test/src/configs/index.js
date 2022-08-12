const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { dbConnect } = require('./database/Connection');
const { databaseHealthMiddleware } = require('../middlewares/DatabaseHealthMiddleware');
const { MulterConfigImg } = require('./multer/MulterConfigs');

async function configure(app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  const dbConnection = await dbConnect();
  app.use(databaseHealthMiddleware(dbConnection));
}

module.exports = { configure, MulterConfigImg };