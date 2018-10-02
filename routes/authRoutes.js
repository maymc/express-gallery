const express = require('express');
const Router = express.Router();
const Users = require('../db/models/users_table.js');

//GET - /logout, user is logged out of site
Router.get('/logout', (req, res) => {
  console.log('This is POST - /logout');
  req.session.destroy();
  console.log('You have been logged out.');
  res.send('You are logged out.');
  // res.redirect('/');
})

//Might need this one for login form, one for actual login
Router.get('/login', (req, res) => {
  console.log('This is GET - /login');
});

//Used to keep track of sessions to check if a user is logged in or not. Use logic to determine this
Router.get('/protected', (req, res) => {
  console.log('This is GET - /protected');
  if (req.session.isLoggedIn) {
    res.send('Welcome back!');
  }
  else {
    res.send('Please login to access this site.');
  }
});

//POST - /register, users can register their own accounts
Router.post('/register', (req, res) => {
  console.log('This is POST - /register');
  const { username, password } = req.body;
  Users
    .forge({ username, password })
    .save()
    .then(result => {
      if (result) {
        res.send("New user has been registered.");
      }
      else {
        res.send("Error w/registering new user.")
      }
    })
    .catch(err => {
      console.log("Error at auth register", err);
      res.send(err);
    })
});

//POST - /login, users login with username and password
Router.post('/login', (req, res) => {
  console.log('This is POST - /login');
  const { username, password } = req.body;
  Users
    .where({ username: username }) //can also be .where({username})
    .fetch()
    .then(user => {
      if (password === user.attributes.password) {
        //Flag to save user to session to keep them logged in
        req.session.isLoggedIn = true;
        res.send("Welcome to ARCHITEKT!");
      }
      else {
        res.send("Invalid username/password. Please try again.");
      }
    })
    .catch(err => {
      console.log('Error at POST login', err);
      res.send(err);
    })
});

module.exports = Router;
// const express = require('express');
// const Router = express.Router();
// const Users = require('../db/models/Users.js');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const bcrypt = require('bcryptjs');
