const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { validationResult } = require('express-validator');
const Product = require('../models/product');
const City = require('../models/city');

// exports.addNames = async (req, res, next) => {
//   await Product.updateMany({ category: '608449f68fcb7523531b7fe1' }, { $set: { name: 'Hospital beds' } }, (err, docs) => {
//     if (err) console.log('Error in updating products');
//     else res.send('Update Successful');

//     return;
//   });
// };

// exports.bulkUpload = async (req, res, next) => {
//   // DO NOT FORGET to add appropriate path
//   const csvFilePath = `/Users/tejasdeshpande/Desktop/fastAidBackend/Csvs/plasmaDB.csv`;
//   let citiesArray = [];
//   let cityIds = [];
//   await City.find({}, (err, docs) => {
//     if (err) console.log('Error in finding cities');
//     docs.forEach((doc, index) => {
//       citiesArray.push(doc.name.toLowerCase());
//       cityIds.push(doc._id);
//     });

//     return;
//   });
//   await csv({
//     noheader: false,
//     // DO NOT FORGET to add appropriate headers
//     headers: ['companyName', 'city', 'email', 'contactNumber', 'address']
//   })
//     .fromFile(csvFilePath)
//     .then(jsonArray => {
//       let uploadable = [];
//       for (element of jsonArray) {
//         if (citiesArray.includes(element.city.toLowerCase())) {
//           // DO NOT FORGET to add appropriate category
//           element.category = '60844a258fcb7523531b7fe5';
//           element.city = cityIds[citiesArray.findIndex(name => name === element.city.toLowerCase())];
//           uploadable.push(element);
//         }
//       }

//       // return res.send(uploadable);

//       Product.insertMany(uploadable, (err, docs) => {
//         if (err) console.log(err);
//         console.log(docs);
//       });

//       return res.send(
//         JSON.stringify({
//           message: 'Uploaded products successfully',
//           products: uploadable
//         })
//       );
//     });
// };

// exports.checkForNewCities = async (req, res, next) => {
//   const csvFilePath = `/Users/tejasdeshpande/Desktop/fastAidBackend/Csvs/plasmaDB.csv`;
//   let citiesArray = [];
//   await City.find({}, (err, docs) => {
//     if (err) console.log('Error in finding cities');
//     docs.forEach((doc, index) => {
//       citiesArray.push(doc.name.toLowerCase());
//     });

//     return;
//   });
//   await csv({
//     noheader: false,
//     headers: ['companyName', 'city', 'email', 'contactNumber', 'address']
//   })
//     .fromFile(csvFilePath)
//     .then(jsonArray => {
//       let newCitiesArray = [];
//       for (element of jsonArray) {
//         if (!citiesArray.includes(element.city.toLowerCase())) newCitiesArray.push(element.city.toLowerCase());
//       }
//       let resArray = [];
//       Array.from(new Set(newCitiesArray)).forEach((element, index) => {
//         resArray.push(element[0].toUpperCase() + element.slice(1));
//       });

//       return res.send(resArray);
//     });
// };

exports.createProduct = (req, res, next) => {
  console.log(req.body);
  const { name, description, category, companyName, address, contactNumber, price, stock, city, user, searchIndex } = req.body;
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
    companyName,
    category,
    address,
    contactNumber,
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
  Product.findByIdAndRemove({ _id: req.params.productId }, (err, deletedProduct) => {
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

exports.getUserProducts = async (req, res, next) => {
  if (req.params.userId) {
    const user = req.params.userId;

    // PAGINATION (10 PRODUCTS PER PAGE)
    const currentPage = req.query.page || 1;
    const perPage = 30;
    let totalItems;

    await Product.countDocuments({ user }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        totalItems = result;
      }
    });

    Product.find({ user })
      .skip((currentPage - 1) * perPage)
      .sort({ _id: -1 })
      .limit(perPage)
      .populate('city')
      .populate('user')
      .populate('category')
      .select('name city address companyName contactNumber price photos stock category')
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
              category: doc.category,
              contactNumber: doc.contactNumber,
              city: doc.city,
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
    res.send('No UserId param in request');
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
      .populate('city')
      .populate('user')
      .populate('category')
      .select('name city address companyName category contactNumber price photos stock')
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
              category: doc.category,
              contactNumber: doc.contactNumber,
              city: doc.city,
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

exports.listBySearch = async (req, res) => {
  const currentPage = req.query.page || 1;
  const perPage = 30;
  let totalCount;

  if (req.query.search) {
    console.log(req.query.search);
    // let str = '';

    // req.query.search.split(' ').forEach(word => {
    //   str += word + '|';
    // });

    const query = {
      $or: [{ name: { $regex: req.query.search, $options: 'i' } }, { searchIndex: { $regex: req.query.search, $options: 'i' } }],
      city: req.params.cityId
    };

    await Product.countDocuments(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        totalCount = result;
      }
    });

    Product.find(query)
      .populate('city')
      .populate('user')
      .select('name city address companyName contactNumber price photos stock')
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .then(docs => {
        return res.status(200).send({
          totalCount,

          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              photos: doc.photos,
              address: doc.address,
              companyName: doc.companyName,
              contactNumber: doc.contactNumber,
              city: doc.city,
              stock: doc.stock,
              _id: doc._id,
              user: doc.user,
              request: {
                type: 'GET',
                url: 'http://159.65.159.82:8000/api/product/' + doc._id
              }
            };
          })
        });
      });
  } else {
    return res.status(400).send('Search query cannot be empty');
  }
};
