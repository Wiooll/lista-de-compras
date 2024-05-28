const db = require('../config/db');

class Produto {
  static adicionar(nome, preco, usuarioId, callback) {
    db.run("INSERT INTO produtos (nome, preco, usuarioId) VALUES (?, ?, ?)", [nome, preco, usuarioId], function(err) {
      callback(err, this.lastID);
    });
  }

  static obterTodos(usuarioId, callback) {
    db.all("SELECT * FROM produtos WHERE usuarioId = ?", [usuarioId], (err, rows) => {
      callback(err, rows);
    });
  }

  static deletar(id, callback) {
    db.run("DELETE FROM produtos WHERE id = ?", [id], function(err) {
      callback(err);
    });
  }
}

module.exports = Produto;
