const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Schema;

const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.createProduct = (req, res, next) => {
  console.log(req.body);
  const { name, description, price, stock, city, user, searchIndex } = req.body;
  let photos = [];
  let i = 0;
  if (req.files.length) {
    while (i < req.files.length) {
      photos.push(req.files[i].path);
      i++;
    }
  }

  console.log(photos);
  const product = new Product({
    name,
    description,
    price,
    stock,
    city,
    photos,
    user,
    searchIndex
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          result,
          request: {
            type: 'GET',
            url: 'http://159.65.159.82:8000/api/product/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to delete the product'
      });
    }
    res.json({
      message: 'Deletion was a success',
      deletedProduct
    });
  });
};

// params middle-ware
exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }
    req.product = product;
    next();
  });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .populate('user', 'city')
    .exec()
    .then(doc => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'next url here'
          }
        });
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  console.log(req.body);
  Product.findById(productId).then(product => {
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    if (req.files.length) {
      let newPhotos = [];
      let i = 0;
      while (i < req.files.length) {
        console.log(req.files[i].path);
        newPhotos.push(req.files[i].path);
        i++;
      }
      //   //clear image from server
      clearImages(product.photos);

      // udate photos
      req.body.photos = newPhotos;
    }

    Product.updateOne({ _id: productId }, { $set: req.body }, { new: true, useFindAndModify: false })
      .then(result => res.send(result))
      .catch(err => console.log(err));
  });
};

const clearImages = filePathArray => {
  let i = 0;
  while (i < filePathArray.length) {
    filePathArray[i] = path.join(__dirname, '..', filePathArray[i]);
    console.log(filePathArray[i]);
    fs.unlink(filePathArray[i], err => console.log(err));
    i++;
  }
};

exports.getProducts = async (req, res, next) => {
  if (req.params.cityId) {
    const city = req.params.cityId;

    // PAGINATION (10 PRODUCTS PER PAGE)
    const currentPage = req.query.page || 1;
    const perPage = 30;
    let totalItems;

    await Product.countDocuments({ city }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        totalItems = result;
      }
    });

    Product.find({ city })
      .skip((currentPage - 1) * perPage)
      .sort({ _id: -1 })
      .limit(perPage)
      .populate('user', 'city')
      .select('name city address companyName contactNumber price photos stock')
      .exec()
      .then(docs => {
        const response = {
          totalCount: totalItems,
          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              photos: doc.photos,
              address: doc.address,
              companyName: doc.companyName,
              contactNumber: doc.contactNumber,
              stock: doc.stock,
              _id: doc._id,
              user: doc.user,
              request: {
                type: 'GET',
                url: 'http://159.65.159.82:8000/api/product/' + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  } else {
    res.send('No City Selected');
  }
};
