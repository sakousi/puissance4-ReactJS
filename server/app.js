const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const validateEnv = require('./utils/validateEnv');
dotenv.config();
// validateEnv();

const app = express();

// MIDDLEWARE
app.use(cookieParser());

// LOGGER
app.use(morgan('dev'));

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION 🔥 Shutting down...');
  console.error('Error🔥', err.message);
  process.exit(1);
});

module.exports = app;