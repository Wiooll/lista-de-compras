const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const router = express.Router();

const secret = 'chaveSecreta';

router.post('/register', async (req, res) => {
  const { username, senha } = req.body;
  Usuario.adicionar(username, senha, (err, userId) => {
    if (err) return res.status(500).send('Erro ao registrar usuário');
    res.status(201).send({ userId });
  });
});

router.post('/login', (req, res) => {
  const { username, senha } = req.body;
  Usuario.encontrarPorUsername(username, async (err, user) => {
    if (err || !user) return res.status(401).send('Usuário não encontrado');
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).send('Senha inválida');
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    res.status(200).send({ token });
  });
});

module.exports = router;
