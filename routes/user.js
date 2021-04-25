const express = require('express');
const router = express.Router();

const { updateUserDetails, getUserById, likeProduct, dislikeProduct } = require('../controllers/user');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');

router.param('userId', getUserById);

router.get('/like/:productId', likeProduct);
router.get('/dislike/:productId', dislikeProduct);
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUserDetails);

module.exports = router;
