const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const { db, verificarCodigoExistente } = require('./database');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  db.all('SELECT * FROM produtos', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro interno no servidor.');
      return;
    }
    res.render('index', { produtos: rows, content: '' });
  });
});

app.get('/add', (req, res) => {
  res.render('add', { content: '' });
});

app.post('/add', async (req, res) => {
  const { nome, codigo, descricao, preco } = req.body;

  try {
    const codigoExistente = await verificarCodigoExistente(codigo);

    if (codigoExistente) {
      return res.render('add', { content: 'Código já existe.' });
    }

    db.run('INSERT INTO produtos (nome, codigo, descricao, preco) VALUES (?, ?, ?, ?)',
      [nome, codigo, descricao, preco],
      (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send('Erro interno no servidor.');
        }
        return res.redirect('/');
      });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return res.status(500).send('Erro interno no servidor.');
  }
});


app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro interno no servidor.');
      return;
    }
    res.render('edit', { produto: row, content: '' });
  });
});

app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { nome, codigo, descricao, preco } = req.body;
  db.run('UPDATE produtos SET nome = ?, codigo = ?, descricao = ?, preco = ? WHERE id = ?',
    [nome, codigo, descricao, preco, id],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro interno no servidor.');
        return;
      }
      res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM produtos WHERE id = ?', [id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro interno no servidor.');
      return;
    }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
