const express = require('express');
const jwt = require('jsonwebtoken');
const Produto = require('../models/Produto');
const router = express.Router();

const secret = 'chaveSecreta';

router.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Não autorizado');
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).send('Não autorizado');
    req.userId = decoded.userId;
    next();
  });
});

router.post('/', (req, res) => {
  const { nome, preco } = req.body;
  Produto.adicionar(nome, preco, req.userId, (err, productId) => {
    if (err) return res.status(500).send('Erro ao adicionar produto');
    res.status(201).send({ productId });
  });
});

router.get('/', (req, res) => {
  Produto.obterTodos(req.userId, (err, produtos) => {
    if (err) return res.status(500).send('Erro ao buscar produtos');
    res.status(200).send(produtos);
  });
});

router.delete('/:id', (req, res) => {
  Produto.deletar(req.params.id, (err) => {
    if (err) return res.status(500).send('Erro ao deletar produto');
    res.status(204).send();
  });
});

module.exports = router;
