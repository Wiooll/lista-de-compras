const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async add(username, password, callback) {
    const hash = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], function(err) {
      callback(err, this.lastID);
    });
  }

  static findByUsername(username, callback) {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      callback(err, row);
    });
  }
}

module.exports = User;
