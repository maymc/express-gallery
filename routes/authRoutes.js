const express = require('express');
const Router = express.Router();
const Users = require('../db/models/users_table.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

//Passport setup

//Upon successful login, get the user from the database and save the userdata into the session which is in Redis
passport.serializeUser((user, done) => {
  console.log("\nSerializing user:\n", user);
  done(null, {
    username: user.attributes.username,
    password: user.attributes.password,
    cat: 'totoro'
  });
});

//Upon successful authorized request, we will take some information from the session to retrieve the user record from db and put it into req.user. 
//Deserializing stores it in req.user. It grabs a key from the session to access user from db so you can access from req.user
passport.deserializeUser((user, done) => {
  console.log("\nDeserializing user:\n", user);
  Users
    .where({ username: user.username })
    .fetch()
    .then(user => {
      //When you access a protected route, it throws your object into req.user
      done(null, user.attributes)
    })
    .catch(err => {
      done(err);
    })
});

//This finds the user and if it doesn't find the user then it will give an error
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
            console.log("---> LocalStrategy result:", result);
            console.log("---> User is authenticated.");
            done(null, user);
          }
          else {
            console.log("---> LocalStrategy result:", result);
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

//POST - /register, users can register their own accounts
Router.post('/register', (req, res) => {
  console.log('\nThis is POST - /auth/register');
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
  //If passes LocalStrategy and serializing, then this block executes
  res.send('You are authenticated.');
})

//Might need this one for login form, one for actual login
Router.get('/login', (req, res) => {
  console.log('\nThis is GET - /auth/login');
  res.render('login');
});

Router.get('/register', (req, res) => {
  console.log('\nThis is GET - /auth/register');
  res.render('register');
})

//GET - /logout, user is logged out of site
Router.get('/logout', (req, res) => {
  console.log('\nThis is POST - /auth/logout');
  req.logout();
  console.log('You have been logged out.');
  res.redirect('/login');
});

//Used to keep track of sessions to check if a user is logged in or not. Use logic to determine this
Router.get('/protected', isAuthenticated, (req, res) => {
  console.log('\nThis is GET - /auth/protected');
  // res.render('myAwesomeDashboard', { user: req.user });
});

//custom middleware
function isAuthenticated(req, res, next) {
  //if it is authenticated then i will go to next middleware function in chain otherwise redirect to homepage. To use this, use router-level middleware
  if (req.isAuthenticated()) {
    console.log("AUTHENTICATED!")
    next();
  }
  else {
    console.log("Not Authenticated.")
    res.redirect('/');
  }
}

module.exports = Router;
