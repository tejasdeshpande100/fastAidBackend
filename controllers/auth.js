const User = require('../models/user');
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const https = require('https');

exports.login = (req, res, next) => {
  let phoneNumber = req.body.phoneNumber;
  let password = req.body.password;
  console.log(phoneNumber, password);
  User.findOne({ phoneNumber }, (err, user) => {
    if (err) {
      // Set proper status code later
      return res.status(422).json('Error Ocurrer in finding user');
    }

    if (!user) {
      let phoneNumber = req.body.phoneNumber;
      let seller = req.body.seller;
      const user = new User({ phoneNumber, password, seller });

      user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            err: 'NOT able to save user in DB'
          });
        }
      });

      // create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //put token in cookie
      res.cookie('token', token, { expire: new Date() + 9999 });

      // send response to front end
      const { _id, name } = user;
      return res.json({ token, user: { _id, phoneNumber, name } });
    }

    if (user) {
      if (!user.autheticate(password)) {
        return res.status(401).json({
          error: 'Incorrect password'
        });
      }

      // create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //put token in cookie
      res.cookie('token', token, { expire: new Date() + 9999 });

      // send response to front end
      const { _id, name, phoneNumber } = user;
      return res.json({ token, user: { _id, name, phoneNumber } });
    }
  });
};

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: 'ACCESS DENIED'
    });
  }
  next();
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth',
  algorithms: ['HS256']
});

exports.signout = (req, res) => {
  res.clearCookie('token');
  console.log('signed out');
  res.json({
    message: 'User signout successfully'
  });
};
