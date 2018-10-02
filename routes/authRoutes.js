const express = require('express');
const Router = express.Router();
const Users = require('../db/models/users_table.js');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const bcrypt = require('bcrypt');

// //Passport setup
// passport.serializeUser((user, done) => {
//   console.log("\nSerializing user:", user);
//   done(null, {
//     username: user.username,
//     password: user.password
//   })
// });
// passport.deserializeUser((user, done) => {
//   console.log("\nDeserializing user:", user);
//   done(null, user);
// });
// //This finds the user
// passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
//   console.log("LocalStrategy...");
//   Users
//     .where({ username })
//     .fetch()
//     .then(user => {
//       console.log('user in localstrategy db', user);
//       bcrypt.compare(password, user.attributes.password)
//         .then(result => {
//           if (result) {
//             done(null, user);
//           }
//           else {
//             done(null, false);
//           }
//         })
//         .catch(err => {
//           done(err);
//         })
//     })
//     .catch(err => {
//       done(err);
//     })
// }));

//GET - /logout, user is logged out of site
Router.get('/logout', (req, res) => {
  console.log('This is POST - /logout');
  req.session.destroy();
  // req.logout();
  console.log('You have been logged out.');
  res.redirect('/');
});

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
  // res.send("Authenicated! Welcome!")
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
