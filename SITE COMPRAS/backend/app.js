const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

module.exports = app;
