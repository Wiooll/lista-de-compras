const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const router = express.Router();

const secret = 'secretKey';

router.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Unauthorized');
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).send('Unauthorized');
    req.userId = decoded.userId;
    next();
  });
});

router.post('/', (req, res) => {
  const { name, price } = req.body;
  Product.add(name, price, req.userId, (err, productId) => {
    if (err) return res.status(500).send('Error adding product');
    res.status(201).send({ productId });
  });
});

router.get('/', (req, res) => {
  Product.getAll(req.userId, (err, products) => {
    if (err) return res.status(500).send('Error fetching products');
    res.status(200).send(products);
  });
});

router.delete('/:id', (req, res) => {
  Product.delete(req.params.id, (err) => {
    if (err) return res.status(500).send('Error deleting product');
    res.status(204).send();
  });
});

module.exports = router;
