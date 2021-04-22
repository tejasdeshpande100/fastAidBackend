const express = require('express');
const router = express.Router();

const { updateUserDetails, getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');

router.param('userId', getUserById);

router.put('/user/:userId', isSignedIn, isAuthenticated, updateUserDetails);

module.exports = router;
