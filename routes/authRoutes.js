const express = require('express');
const Router = express.Router();
const Users = require('../db/models/users_table.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

//Passport setup

//Upon successful login, get user from database, save user data into session which is in Redis
passport.serializeUser((user, done) => {
  console.log("\nSerializing user:\n", user);
  done(null, {
    username: user.attributes.username,
    password: user.attributes.password,
    cat: 'totoro'
  });
});

//Upon successful authorized request, we will take some information from the session to retrieve the user record from db and put it into req.user
passport.deserializeUser((user, done) => {
  console.log("\nDeserializing user:\n", user);
  Users
    .where({ id: user.username })
    .fetch()
    .then(user => {
      done(null, user.attributes)
    })
    .catch(err => {
      done(err);
    })
});

//This finds the user and if it doesn't find the user then it will give an error, if not the user passes
passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
  console.log("---> LocalStrategy is working...");
  Users
    .where({ username })
    .fetch()
    .then(user => {
      console.log('---> LocalStrategy user:', user);
      bcrypt.compare(password, user.attributes.password)
        .then(result => {
          console.log("Compare - password:", password);
          console.log("Compare - localstrategy password:", user.attributes.password);
          console.log("LocalStrategy Result:", result);
          if (result) {
            console.log("---> LocalStrategy results is true:", result);
            console.log("**User is authenticated.");
            done(null, user);
          }
          else {
            console.log("---> LocalStrategy results is false:", result);
            done(null, false);
          }
        })
        .catch(err => {
          console.log("1st error:", err);
          done(err);
        })
    })
    .catch(err => {
      console.log("2nd error:", err);
      done(err);
    })
}));

//~~~~~GET, POST, PUT, DELETE routes~~~~~//

//Might need this one for login form, one for actual login
Router.get('/login', (req, res) => {
  console.log('This is GET - /auth/login');
  req.render('login');
});

//POST - /register, users can register their own accounts
Router.post('/register', (req, res) => {
  console.log('This is POST - /auth/register');
  const { username, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hashedPassword => {
      return Users
        .forge({ username, password: hashedPassword })
        .save()
    })
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
Router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  //If passes, then this block executes
  res.send('Yay authenticated!');
})

//GET - /logout, user is logged out of site
Router.get('/logout', (req, res) => {
  console.log('This is POST - /auth/logout');
  req.logout();
  console.log('You have been logged out.');
  res.redirect('/');
});

//Used to keep track of sessions to check if a user is logged in or not. Use logic to determine this
Router.get('/protected', (req, res) => {
  console.log('This is GET - /auth/protected');
  if (req.isAuthenticated()) {
    res.send('Welcome back!');
  }
  else {
    res.send('Please login to access this site.');
  }
});

module.exports = Router;
