const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const axios = require('axios');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', async(req, res, next) => {
  try {
  const { email } = req.body;
  res.cookie('userEmail', email);
  if (email) {
    const doc = await User.find({email: email});
    let message = `logs in.`
      let userName = doc[0].name;
      let userId = doc[0]._id;
      let body2 = {
          userName, userId, message
      }
      
    axios.post("http://localhost:5000/api/audit", body2);
     
    
  console.log("Login request recieved!");
  await passport.authenticate('local', {
    successRedirect: '/cards',
    failureRedirect: '/users/login',
    failureFlash: true
  }) (req, res, () => {
    // Store user ID in session
    console.log("huehue")
    res.redirect('/cards');
  });
}  } catch(e) {
  console(e)
}
});
// router.post('/login', (req, res, next) => {
//   console.log("Login request recieved!");
//   passport.authenticate('local', {
//     successRedirect: '/cards',
//     failureRedirect: '/users/login',
//     failureFlash: true
//   })(req, res, next);
// });

//get user after login
router.get('/me', async (req, res) => {
  console.log("Me request called! ")
  const userEmail = req.cookies.userEmail;
   if (!userEmail) {
     return res.status(401).send('Not authenticated');
   }
  const doc = await User.find({email: userEmail});
    res.send(doc);

});

// Logout
router.get('/logout', async(req, res) => {
  const userEmail = req.cookies.userEmail;
  if (userEmail) {
   
  const doc = await User.find({email: userEmail});
  let message = `logs out.`
    let userName = doc[0].name;
    let userId = doc[0]._id;
    let body2 = {
        userName, userId, message
    }
    try {
      axios.post("http://localhost:5000/api/audit", body2);
        } catch(e) {
          console(e)
        }
  }
 

  console.log("Logout request recieved!");
  req.logout(function (error) {
    if (error) { return next(error); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

});

module.exports = router;