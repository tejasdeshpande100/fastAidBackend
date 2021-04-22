var express = require('express');
var router = express.Router();

const { getCities, addCity } = require('../controllers/city');

router.post('/city/addCity', addCity);
router.get('/city/getCities', getCities);

module.exports = router;
