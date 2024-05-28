// backend/server.js
const authRoutes = require('./routes/auth');

// Adicione as rotas de autenticação
app.use('/api/auth', authRoutes);
