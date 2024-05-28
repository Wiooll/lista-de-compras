const db = require('../config/db');
const bcrypt = require('bcrypt');

class Usuario {
  static async adicionar(username, senha, callback) {
    const hash = await bcrypt.hash(senha, 10);
    db.run("INSERT INTO usuarios (username, senha) VALUES (?, ?)", [username, hash], function(err) {
      callback(err, this.lastID);
    });
  }

  static encontrarPorUsername(username, callback) {
    db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, row) => {
      callback(err, row);
    });
  }
}

module.exports = Usuario;
