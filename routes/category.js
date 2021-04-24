var express = require('express');
var router = express.Router();

const { getCategories, createCategory } = require('../controllers/category');

router.get('/categories', getCategories);
router.post('/category/create', createCategory);

module.exports = router;
