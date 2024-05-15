const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const produtoRoutes = require('./routes/produtos');

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);

module.exports = app;
