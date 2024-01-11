const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('produtos.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY, nome TEXT, codigo TEXT, descricao TEXT, preco REAL)');
});

function verificarCodigoExistente(codigo) {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM produtos WHERE codigo = ?', [codigo], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count > 0);
        }
      });
    });
  }
  
  module.exports = { db, verificarCodigoExistente };
