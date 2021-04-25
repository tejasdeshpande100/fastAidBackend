var express = require('express');
var router = express.Router();

const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { createProduct, deleteProduct, getProductById, updateProduct, getProduct, getProducts, getUserProducts, listBySearch, checkForNewCities, bulkUpload, addNames } = require('../controllers/product');
const { getUserById } = require('../controllers/user');
const { upload } = require('../controllers/multer');

//all of params
router.param('userId', getUserById);
router.param('productId', getProductById);

// Update Product
router.put('/product/update/:productId/:userId', isSignedIn, isAuthenticated, upload.array('images', 8), updateProduct);
// router.get('/addNames', addNames);
router.post('/product/create/:userId', isSignedIn, isAuthenticated, upload.array('images', 8), createProduct);
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, deleteProduct);
router.get('/products/:cityId', getProducts);
router.get('/product/:productId', getProduct);
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, deleteProduct);
router.get('/products/user/:userId', getUserProducts);
router.get('/search/products/:cityId', listBySearch);
// router.get('/check-for-new-cities', checkForNewCities);
// router.get('/bulkUpload', bulkUpload);

module.exports = router;
