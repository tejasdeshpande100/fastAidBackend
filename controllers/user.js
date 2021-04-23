const User = require('../models/user');

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'No user was found in DB'
      });
    }
    req.profile = user;
    next();
  });
};

exports.updateUserDetails = (req, res) => {
  console.log(req.body);

  User.findByIdAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true, useFindAndModify: false }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: 'You are not authorized to update this user'
      });
    }
    user.salt = undefined;
    user.encry_password = undefined;
    res.json(user);
  });
};