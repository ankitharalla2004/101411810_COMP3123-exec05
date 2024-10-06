const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');
let users =[];


app.use(express.json());


router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html')); 
});

router.get('/profile', (req, res) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Error reading user data' });
    }
    let userData = JSON.parse(data);
    res.json(userData);
  });
});

fs.readFile('./user.json', 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading file:', err);
      return;
  }
  try {
      users = JSON.parse(data); 
  } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!Array.isArray(users)) {
      return res.status(500).send({ message: 'Users data is not available' });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
      res.status(200).send({ message: 'Login successful', user });
  } else {
      res.status(401).send({ message: 'Invalid username or password' });
  }
});



router.get('/logout', (req, res) => {
  const username = req.query.username;
  if (username) {
    res.send(`<b>${username} successfully logged out.</b>`);
  } else {
    res.status(400).send('Username is required to log out.');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<h1>Server Error</h1>');
});

app.use('/', router);

app.listen(process.env.port || 8085, () => {
  console.log('Web Server is listening at port ' + (process.env.port || 8085));
});
