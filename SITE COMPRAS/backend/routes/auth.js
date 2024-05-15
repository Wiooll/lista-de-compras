const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

const secret = 'secretKey';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  User.add(username, password, (err, userId) => {
    if (err) return res.status(500).send('Error registering user');
    res.status(201).send({ userId });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, async (err, user) => {
    if (err || !user) return res.status(401).send('User not found');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Invalid password');
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    res.status(200).send({ token });
  });
});

module.exports = router;
