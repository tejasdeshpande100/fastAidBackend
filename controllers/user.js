const User = require('../models/user');
const Product = require('../models/product');

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

exports.likeProduct = async (req, res) => {
  Product.updateOne({ _id: req.params.productId }, { $inc: { likes: 1 } }, { new: true, useFindAndModify: false })
    .then(result => res.send(result))
    .catch(err => console.log(err));
};

exports.dislikeProduct = async (req, res) => {
  Product.updateOne({ _id: req.params.productId }, { $inc: { dislikes: 1 } }, { new: true, useFindAndModify: false })
    .then(result => res.send(result))
    .catch(err => console.log(err));
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
