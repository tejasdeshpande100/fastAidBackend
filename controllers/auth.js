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
      const newUser = new User({ phoneNumber, password });

      newUser.save((err, user) => {
        if (err) {
          return res.status(400).json({
            err: 'NOT able to save user in DB'
          });
          user = newUser;
        }
      });
    }
    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie('token', token, { expire: new Date() + 9999 });

    // send response to front end
    const { _id, phoneNumber } = user;
    return res.json({ token, user: { _id, phoneNumber } });
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
