  const express = require('express');
  const app = express();
  const session = require('express-session');
  const cookie = require('cookie-parser');
  const bodyParser = require('body-parser');
  const nocache = require('nocache');

  const PORT = process.env.PORT || 3000;

  app.use(cookie());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  app.use(nocache());

  app.set('view engine', 'ejs');

  const users = [{ id: 1, username: 'user', password: '123', role: 'user' }];

  function findUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
  }

  //routing
  app.get('/', (req, res) => {
    if (req.session.user) {
      res.redirect('/dashboard');
    } else {
      res.render('login', { message: '' });
    }
  });

  app.get('/login', (req, res) => {
    res.redirect('/');
  });

  app.post('/login', (req, res) => { 
    const { username, password } = req.body;
    const user = findUser(username, password);

    if (user) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      res.render('login', { message: 'Invalid username or password. Please try again.' });
    }
  });

  app.get('/dashboard', (req, res) => {
    if (req.session.user) {
      res.render('dashboard', { user: req.session.user });
    } else {
      res.redirect('/');
    }
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
