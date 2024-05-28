// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret_key'; // Use uma chave secreta mais segura e configure-a como variável de ambiente

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token is not valid' });
  }
};
