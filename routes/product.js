var express = require('express');
var router = express.Router();

const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { createProduct, deleteProduct, getProductById, updateProduct, getProduct, getProducts } = require('../controllers/product');
const { getUserById } = require('../controllers/user');
const { upload } = require('../controllers/multer');

//all of params
router.param('userId', getUserById);
router.param('productId', getProductById);

// Update Product
router.put('/product/update/:productId/:userId', isSignedIn, isAuthenticated, upload.array('images', 8), updateProduct);

router.post('/product/create/:userId', isSignedIn, isAuthenticated, upload.array('images', 8), createProduct);
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, deleteProduct);
router.get('/products/:cityId', getProducts);
router.get('/product/:productId', getProduct);

module.exports = router;
