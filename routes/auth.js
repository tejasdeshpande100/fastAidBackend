var express = require('express');
var router = express.Router();

const { check } = require('express-validator');
const { login, signout } = require('../controllers/auth');

router.post('/login', [check('password', 'password should be at least 3 char').isLength({ min: 6 }).isAlphanumeric()], login);
router.get('/signout', signout);

module.exports = router;
