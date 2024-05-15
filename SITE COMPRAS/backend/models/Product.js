const db = require('../config/db');

class Product {
  static add(name, price, userId, callback) {
    db.run("INSERT INTO products (name, price, userId) VALUES (?, ?, ?)", [name, price, userId], function(err) {
      callback(err, this.lastID);
    });
  }

  static getAll(userId, callback) {
    db.all("SELECT * FROM products WHERE userId = ?", [userId], (err, rows) => {
      callback(err, rows);
    });
  }

  static delete(id, callback) {
    db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
      callback(err);
    });
  }
}

module.exports = Product;
