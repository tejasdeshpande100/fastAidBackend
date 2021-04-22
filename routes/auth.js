var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');
const { login } = require('../controllers/auth');

router.post('/login', [check('password', 'password should be at least 3 char').isLength({ min: 6 }).isAlphanumeric()], login);

module.exports = router;
